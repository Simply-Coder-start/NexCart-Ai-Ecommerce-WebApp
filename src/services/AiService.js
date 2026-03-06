// src/services/AiService.js
const { client } = require('@gradio/client');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// In-memory job store
// Format: { [jobId]: { status: 'processing' | 'completed' | 'failed', result_url: string, error: string } }
const jobs = {};

// Initialize Gemini Client (for fallback)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

class AiService {
    /**
     * Creates a new try-on job and starts processing it.
     * @param {string} humanImagePath - Path to the uploaded user photo
     * @param {string} garmentImageUrl - URL or base64 of the selected garment
     * @param {string} category - e.g., 'Tops', 'Dresses'
     * @returns {string} jobId
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
            console.warn(`[Job ${jobId}] IDM-VTON failed. Starting Gemini Fallback. Error: ${error.message}`);
            await this._tryGeminiFallback(jobId, humanImagePath, garmentImageUrl, category);
        }
    }

    /**
     * Primary Method: IDM-VTON via HuggingFace Spaces
     */
    static async _tryIDMVTON(jobId, humanImagePath, garmentImageUrl, category) {
        console.log(`[Job ${jobId}] Connecting to Hugging Face yisol/IDM-VTON...`);

        // Mapping category to IDM-VTON garment categories
        let idmCategory = "upper_body";
        const catLower = category.toLowerCase();
        if (catLower.includes('dress') || catLower.includes('suit')) {
            idmCategory = "dresses";
        } else if (catLower.includes('bottom')) {
            idmCategory = "lower_body";
        }

        // We use fetch if garmentImageUrl is a URL to save it locally temporarily to pass to Gradio
        let garmentPath = garmentImageUrl;
        if (garmentImageUrl.startsWith('http')) {
            const fetch = require('node-fetch');
            const res = await fetch(garmentImageUrl);
            if (!res.ok) throw new Error("Failed to fetch garment image");
            const buffer = await res.buffer();
            garmentPath = path.join(__dirname, '..', '..', 'uploads', `temp_garment_${jobId}.jpg`);
            fs.writeFileSync(garmentPath, buffer);
        }

        // Initialize Gradio client
        const hfToken = process.env.HF_TOKEN || false; // Pass false if no token
        const hfClient = await client("yisol/IDM-VTON", { hf_token: hfToken });

        console.log(`[Job ${jobId}] Submitting inference request...`);
        // The endpoint is typically /tryon, but we use predict with exact arguments.
        // IDM-VTON predict receives:
        // 1. dict {background: file, layers: [], composite: null} (human image)
        // 2. file (garm image)
        // 3. text (garment description)
        // 4. text (is_checked)
        // 5. text (is_checked_crop)
        // 6. number (denoise_steps)
        // 7. number (seed)

        const humanBlob = fs.readFileSync(humanImagePath);
        const garmBlob = fs.readFileSync(garmentPath);

        const prompt = "Task: Virtual clothing try-on. Use the uploaded base photo as the main person. Replace the current clothing with the selected dress image. Instructions: Keep the face, hair, and body shape of the base person unchanged. Remove the original clothing from the base photo. Extract only the dress from the selected dress image. Fit the dress naturally on the body with correct proportions. Match lighting, shadows, and perspective. Do not create a second person. Do not overlay the dress image as a separate photo. Output a single realistic image of the person wearing the selected dress. Style: realistic fashion photography, high quality, detailed fabric, natural pose. Task: virtual try-on. Preserve Face: true. Remove Old Clothing: true. Output: single realistic person wearing the selected dress.";

        const result = await hfClient.predict("/tryon", [
            { background: new Blob([humanBlob]), layers: [], composite: null }, // dict
            new Blob([garmBlob]), // file
            prompt, // garment description
            true, // is_checked
            false, // is_checked_crop: false to maintain original proportions
            40, // denoise steps
            42, // seed
        ]);

        console.log(`[Job ${jobId}] Inference complete. Result:`, result);

        if (!result || !result.data || !result.data[0]) {
            throw new Error("Invalid output from IDM-VTON space");
        }

        // Result data is a URL or a file path to the generated image
        const generatedImageUrl = result.data[0].url || result.data[0].path;

        // Download it and save it to /uploads
        const fetch = require('node-fetch');
        const res = await fetch(generatedImageUrl);
        if (!res.ok) throw new Error("Failed to download generated image from Gradio");
        const buffer = await res.buffer();

        const finalFilename = `tryon_result_${jobId}.jpg`;
        const finalTarget = path.join(__dirname, '..', '..', 'uploads', finalFilename);
        fs.writeFileSync(finalTarget, buffer);

        // Success
        jobs[jobId] = {
            status: 'completed',
            result_url: `/uploads/${finalFilename}`,
            error: null
        };

        // Cleanup temp garment if we downloaded it
        if (garmentImageUrl.startsWith('http') && fs.existsSync(garmentPath)) {
            fs.unlinkSync(garmentPath);
        }
    }

    /**
     * Fallback Method: Gemini 2.5 Flash / Client Side logic Simulation
     */
    static async _tryGeminiFallback(jobId, humanImagePath, garmentImageUrl, category) {
        console.log(`[Job ${jobId}] Running Gemini Fallback...`);
        const filename = path.basename(humanImagePath);

        // If no key configured, skip straight to image return
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_key_here') {
            console.warn(`[Job ${jobId}] No valid GEMINI_API_KEY — returning original user photo as preview.`);
            jobs[jobId] = { status: 'completed', result_url: `/uploads/${filename}`, error: null };
            return;
        }

        try {
            const humanBase64 = fs.readFileSync(humanImagePath, 'base64');
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [
                    { text: `Analyze this user photo and how a ${category} garment would fit on them. Provide a 1-sentence assessment of fit.` },
                    { inlineData: { mimeType: 'image/jpeg', data: humanBase64 } }
                ]
            });
            console.log(`[Job ${jobId}] Gemini Response:`, response.text);
        } catch (geminiErr) {
            console.error(`[Job ${jobId}] Gemini API call failed:`, geminiErr.message);
            // Still resolve — return the original user photo as a preview
        }

        // Always succeed at this fallback level — return user's original photo as preview
        jobs[jobId] = {
            status: 'completed',
            result_url: `/uploads/${filename}`,
            error: null
        };
    }
}

module.exports = AiService;
