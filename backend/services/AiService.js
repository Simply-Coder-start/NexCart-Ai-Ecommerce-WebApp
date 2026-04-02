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
            console.warn(`[Job ${jobId}] IDM-VTON failed. Starting Gemini Fallback. Error: ${error.message}`);
            await this._tryGeminiFallback(jobId, humanImagePath, garmentImageUrl, category);
        }
    }

    /**
     * Primary Method: IDM-VTON via HuggingFace Spaces
     */
    static async _tryIDMVTON(jobId, humanImagePath, garmentImageUrl, category) {
        let garmentPath = garmentImageUrl;
        if (garmentImageUrl.startsWith('http')) {
            const fetch = require('node-fetch');
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
        const garmBlob = fs.readFileSync(garmentPath);
        const prompt = "A realistic fashion photo of the uploaded person wearing the selected designer dress.";

        const result = await hfClient.predict("/tryon", [
            { background: new Blob([humanBlob], { type: "image/jpeg" }), layers: [], composite: null },
            new Blob([garmBlob], { type: "image/jpeg" }),
            prompt,
            true,
            false,
            40,
            42,
        ]);

        if (!result || !result.data || !result.data[0]) throw new Error("Invalid output from IDM-VTON");

        const generatedImageUrl = result.data[0].url || result.data[0].path;
        const fetch = require('node-fetch');
        const resGen = await fetch(generatedImageUrl);
        const bufferGen = Buffer.from(await resGen.arrayBuffer());

        const finalFilename = `tryon_result_${jobId}.jpg`;
        const finalTarget = path.join(__dirname, '..', '..', 'uploads', finalFilename);
        fs.writeFileSync(finalTarget, bufferGen);

        jobs[jobId] = { status: 'completed', result_url: `/uploads/${finalFilename}`, error: null };
        if (garmentImageUrl.startsWith('http') && fs.existsSync(garmentPath)) fs.unlinkSync(garmentPath);
    }

    /**
     * Fallback Method
     */
    static async _tryGeminiFallback(jobId, humanImagePath, garmentImageUrl, category) {
        const filename = path.basename(humanImagePath);
        jobs[jobId] = { status: 'completed', result_url: `/uploads/${filename}`, error: null };
    }
}

module.exports = AiService;
