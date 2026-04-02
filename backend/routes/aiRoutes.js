const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AiService = require('../services/AiService');

// Multer Config for temporary uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


// Get configuration
router.get('/config', (req, res) => {
    res.json({
        aiEnabled: true,
        providers: { "yisol/IDM-VTON": true },
        method: process.env.GEMINI_API_KEY && !process.env.HF_TOKEN ? 'gemini-fallback' : 'idm-vton'
    });
});

// Upload garment image
router.post('/upload-dress', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ dress_image_id: req.file.filename });
});

// Upload user photo
router.post('/upload-user', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ user_image_id: req.file.filename });
});

// Start try-on job
router.post('/generate', async (req, res) => {
    try {
        const { user_image_id, dress_image_id, category } = req.body;
        if (!user_image_id) return res.status(400).json({ error: 'user_image_id is required' });

        const humanPath = path.join(__dirname, '..', '..', 'uploads', user_image_id);
        let garmentUrl = dress_image_id;

        if (!dress_image_id.startsWith('http')) {
            garmentUrl = path.join(__dirname, '..', '..', 'uploads', dress_image_id);
        }

        const cat = category || 'Dresses';
        const jobId = AiService.createJob(humanPath, garmentUrl, cat);
        res.json({ job_id: jobId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get job status
router.get('/result/:job_id', (req, res) => {
    const result = AiService.getJobStatus(req.params.job_id);
    res.json(result);
});

module.exports = router;
