// src/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductService = require('../services/ProductService');
const AiService = require('../services/AiService');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// === AUTH ROUTES ===
router.post('/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    // Simple mock
    res.json({
        message: 'Registered successfully',
        token: 'mock-jwt-token-777',
        user: { name, email }
    });
});

router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Simple mock
    res.json({
        message: 'Login successful',
        token: 'mock-jwt-token-777',
        user: { name: email.split('@')[0], email }
    });
});

// === PRODUCT ROUTES ===
router.get('/products', async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/products/search', async (req, res) => {
    try {
        const { q, category } = req.query;
        const products = await ProductService.searchProducts(q || '', category || 'all');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === AI TRY-ON ROUTES ===
router.get('/tryon/config', (req, res) => {
    res.json({
        aiEnabled: true,
        providers: { "yisol/IDM-VTON": true },
        method: process.env.GEMINI_API_KEY && !process.env.HF_TOKEN ? 'gemini-fallback' : 'idm-vton'
    });
});

// Single image upload endpoints (they just return the generated filename)
router.post('/upload-dress', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ dress_image_id: req.file.filename });
});

router.post('/upload-user', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ user_image_id: req.file.filename });
});

// Start try-on job
router.post('/generate', async (req, res) => {
    try {
        const { user_image_id, dress_image_id, view_mode, category } = req.body;
        if (!user_image_id) return res.status(400).json({ error: 'user_image_id is required' });

        const humanPath = path.join(__dirname, '..', '..', 'uploads', user_image_id);

        let garmentUrl = dress_image_id;
        if (!dress_image_id.startsWith('http')) {
            garmentUrl = path.join(__dirname, '..', '..', 'uploads', dress_image_id);
        }

        // We use category if provided. If not, default to "Dresses".
        const cat = category || 'Dresses';
        const jobId = AiService.createJob(humanPath, garmentUrl, cat);
        res.json({ job_id: jobId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/result/:job_id', (req, res) => {
    const result = AiService.getJobStatus(req.params.job_id);
    res.json(result);
});

module.exports = router;
