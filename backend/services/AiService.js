// backend/services/AiService.js
const { client } = require('@gradio/client');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// In-memory job store
const jobs = {};

// Initialize Gemini Client (lazily)
let ai = null;
const getAi = () => {
    if (ai) return ai;
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '') {
        console.warn('⚠️ GEMINI_API_KEY not found — AI Fallback will return original photos as previews.');
        return null;
    }
    ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
    return ai;
};

class AiService {
    /**
     * Creates a new try-on job and starts processing it.
     */
    static createJob(humanImagePath, garmentImageUrl, category) {
        const jobId = crypto.randomUUID();
        jobs[jobId] = { status: 'processing', result_url: null, error: null };

        // Start async processing
        this._processJob(jobId, humanImagePath, garmentImageUrl, category).catch(err => {
            console.error(`[Job ${jobId}] Failed totally:`, err);
            jobs[jobId].status = 'failed';
            jobs[jobId].error = err.message || 'Unknown error occurred.';
        });

        return jobId;
    }

    /**
     * Gets the status of a job
     */
    static getJobStatus(jobId) {
        if (!jobs[jobId]) {
            return { status: 'not_found', result_url: null, error: 'Job ID not found' };
        }
        return jobs[jobId];
    }

    /**
     * Internal generic processing method
     */
    static async _processJob(jobId, humanImagePath, garmentImageUrl, category) {
        console.log(`[Job ${jobId}] Starting AI Virtual Try-On...`);
        try {
            await this._tryIDMVTON(jobId, humanImagePath, garmentImageUrl, category);
        } catch (error) {
            console.warn(`[Job ${jobId}] IDM-VTON failed (${error.message}). Starting Gemini Fallback...`);
            await this._tryGeminiFallback(jobId, humanImagePath, garmentImageUrl, category);
        }
    }

    /**
     * Primary Method: IDM-VTON via HuggingFace Spaces
     */
    static async _tryIDMVTON(jobId, humanImagePath, garmentImageUrl, category) {
        let garmentPath = garmentImageUrl;
        if (garmentImageUrl.startsWith('http')) {
            const res = await fetch(garmentImageUrl);
            if (!res.ok) throw new Error("Failed to fetch garment image");
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            garmentPath = path.join(__dirname, '..', '..', 'uploads', `temp_garment_${jobId}.jpg`);
            fs.writeFileSync(garmentPath, buffer);
        }

        const hfToken = process.env.HF_TOKEN || false;
        const hfClient = await client("yisol/IDM-VTON", { hf_token: hfToken });

        const humanBlob = fs.readFileSync(humanImagePath);
        const garmBlobRaw = fs.readFileSync(garmentPath);
        
        // ── AI Preprocessing (Background Removal via direct REST) ──
        // @gradio/client times out on BRIA-RMBG-1.4's WebSocket handshake.
        // We call the Gradio REST queue API directly — same protocol the browser uses.
        let processedGarmBlob = garmBlobRaw;
        try {
            console.log(`[Job ${jobId}] Pre-processing garment with BRIA-RMBG-1.4 (direct REST)...`);
            const RMBG_BASE = 'https://briaai-bria-rmbg-1-4.hf.space';
            const hfHeaders = hfToken ? { Authorization: `Bearer ${hfToken}` } : {};

            // 1) Upload the garment image to the space
            const formData = new FormData();
            formData.append('files', new Blob([garmBlobRaw], { type: 'image/jpeg' }), 'garment.jpg');
            const uploadRes = await fetch(`${RMBG_BASE}/upload`, {
                method: 'POST',
                headers: hfHeaders,
                body: formData,
            });
            if (!uploadRes.ok) throw new Error(`RMBG upload failed: ${uploadRes.status}`);
            const uploadedPaths = await uploadRes.json(); // ["tmp/...filename.jpg"]
            const uploadedPath = uploadedPaths[0];

            // 2) Submit predict job to the queue
            const joinRes = await fetch(`${RMBG_BASE}/queue/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...hfHeaders },
                body: JSON.stringify({
                    fn_index: 0,
                    data: [{ path: uploadedPath, orig_name: 'garment.jpg', mime_type: 'image/jpeg' }],
                    session_hash: jobId.replace(/-/g, '').substring(0, 16),
                }),
            });
            if (!joinRes.ok) throw new Error(`RMBG queue join failed: ${joinRes.status}`);
            const { event_id } = await joinRes.json();

            // 3) Poll /queue/data (SSE) until we get the COMPLETE event
            const dataUrl = `${RMBG_BASE}/queue/data?session_hash=${jobId.replace(/-/g, '').substring(0, 16)}`;
            let rmbgOutputUrl = null;
            const sseRes = await fetch(dataUrl, { headers: hfHeaders });
            const reader = sseRes.body.getReader();
            const decoder = new TextDecoder();
            let buf = '';
            const timeout = Date.now() + 60000; // 60s max
            outer: while (Date.now() < timeout) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                const lines = buf.split('\n');
                buf = lines.pop();
                for (const line of lines) {
                    if (!line.startsWith('data:')) continue;
                    const evt = JSON.parse(line.slice(5).trim());
                    if (evt.msg === 'process_completed' && evt.output?.data?.[0]) {
                        rmbgOutputUrl = evt.output.data[0].url || evt.output.data[0].path;
                        break outer;
                    }
                    if (evt.msg === 'process_errored') throw new Error(`RMBG space error: ${evt.output?.error}`);
                }
            }
            reader.cancel();

            if (rmbgOutputUrl) {
                if (!rmbgOutputUrl.startsWith('http')) rmbgOutputUrl = `${RMBG_BASE}/file=${rmbgOutputUrl}`;
                const resRmbg = await fetch(rmbgOutputUrl, { headers: hfHeaders });
                processedGarmBlob = Buffer.from(await resRmbg.arrayBuffer());
                console.log(`[Job ${jobId}] ✅ Background removed from garment.`);
            } else {
                throw new Error('RMBG timed out waiting for result.');
            }
        } catch (rmbgErr) {
            console.warn(`[Job ${jobId}] RMBG-1.4 pre-processing failed, using original garment. Error:`, rmbgErr.message);
        }

        const prompt = "A realistic fashion photo of the uploaded person wearing the selected designer dress.";

        const result = await hfClient.predict("/tryon", [
            { background: new Blob([humanBlob], { type: "image/jpeg" }), layers: [], composite: null },
            new Blob([processedGarmBlob], { type: "image/png" }),
            prompt,
            true,
            false,
            40,
            42,
        ]);

        if (!result || !result.data || !result.data[0]) throw new Error("Invalid output from IDM-VTON");

        const generatedImageUrl = result.data[0].url || result.data[0].path;
        const resGen = await fetch(generatedImageUrl);
        const bufferGen = Buffer.from(await resGen.arrayBuffer());

        const finalFilename = `tryon_result_${jobId}.jpg`;
        const finalTarget = path.join(__dirname, '..', '..', 'uploads', finalFilename);
        fs.writeFileSync(finalTarget, bufferGen);

        jobs[jobId] = { status: 'completed', result_url: `/uploads/${finalFilename}`, error: null };
        if (garmentImageUrl.startsWith('http') && fs.existsSync(garmentPath)) fs.unlinkSync(garmentPath);
    }

    /**
     * Fallback Method: Gemini Vision Try-On
     * Uses Gemini's multimodal model to generate a try-on composite when IDM-VTON is unavailable.
     */
    static async _tryGeminiFallback(jobId, humanImagePath, garmentImageUrl, category) {
        const gemini = getAi();
        if (!gemini) {
            console.warn(`[Job ${jobId}] GEMINI_API_KEY not set — skipping Gemini fallback.`);
            throw new Error('GEMINI_API_KEY not configured.');
        }

        console.log(`[Job ${jobId}] Attempting Gemini vision try-on fallback...`);

        // Read human image as base64
        const humanBuffer = fs.readFileSync(humanImagePath);
        const humanBase64 = humanBuffer.toString('base64');

        // Read or fetch garment image as base64
        let garmentBase64;
        let garmentMime = 'image/jpeg';
        if (garmentImageUrl.startsWith('http')) {
            const res = await fetch(garmentImageUrl);
            if (!res.ok) throw new Error(`Failed to fetch garment image: ${res.status}`);
            const buf = Buffer.from(await res.arrayBuffer());
            garmentBase64 = buf.toString('base64');
        } else {
            const buf = fs.readFileSync(garmentImageUrl);
            garmentBase64 = buf.toString('base64');
            // Detect image type from the path
            if (garmentImageUrl.toLowerCase().endsWith('.png')) garmentMime = 'image/png';
        }

        const prompt = `You are a virtual fashion try-on AI. 
You are given two images:
1. A person (the first image) 
2. A ${category} garment (the second image)

Generate a realistic photo of the person wearing that garment. 
Preserve the person's face, skin tone, and body shape exactly.
Only change what they are wearing to match the provided garment.
Make it look like a professional fashion photo.`;

        // Image-capable models confirmed via ListModels API:
        const IMAGE_MODELS = [
            'gemini-2.5-flash-image',
            'gemini-3.1-flash-image-preview',
            'gemini-3-pro-image-preview',
        ];

        let result;
        let usedModel;
        for (const modelName of IMAGE_MODELS) {
            try {
                console.log(`[Job ${jobId}] Trying Gemini model: ${modelName}...`);
                result = await gemini.models.generateContent({
                    model: modelName,
                    contents: [{
                        role: 'user',
                        parts: [
                            { text: prompt },
                            { inlineData: { mimeType: 'image/jpeg', data: humanBase64 } },
                            { inlineData: { mimeType: garmentMime, data: garmentBase64 } }
                        ]
                    }],
                    config: {
                        responseModalities: ['Text', 'Image'],
                    }
                });
                usedModel = modelName;
                break;
            } catch (modelErr) {
                console.warn(`[Job ${jobId}] Model ${modelName} failed: ${modelErr.message?.substring(0, 160)}`);
            }
        }
        if (!result) throw new Error('All Gemini image models failed.');

        // Extract image from response
        const parts = result?.candidates?.[0]?.content?.parts || [];
        console.log(`[Job ${jobId}] Gemini response parts count: ${parts.length}`);
        const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

        if (!imagePart?.inlineData?.data) {
            // Log the full response for debugging
            const textPart = parts.find(p => p.text);
            console.warn(`[Job ${jobId}] Gemini returned no image. Text response: ${textPart?.text?.substring(0, 200) || 'none'}`);
            throw new Error('Gemini did not return an image. The model may not support image generation for this input.');
        }

        const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
        const finalFilename = `tryon_gemini_${jobId}.jpg`;
        const finalTarget = path.join(__dirname, '..', '..', 'uploads', finalFilename);
        fs.writeFileSync(finalTarget, imageBuffer);

        jobs[jobId] = {
            status: 'completed',
            result_url: `/uploads/${finalFilename}`,
            error: null,
            method: `gemini:${usedModel}`
        };
        console.log(`[Job ${jobId}] ✅ Gemini try-on complete via ${usedModel}.`);
    }
}

module.exports = AiService;
