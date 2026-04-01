// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.FRONTEND_PORT || 3000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Ensure uploads and images directories exist
const uploadsPath = path.join(__dirname, '..', 'uploads');
const imagesPath = path.join(__dirname, '..', 'frontend', 'images');
app.use('/uploads', express.static(uploadsPath));
app.use('/images', express.static(imagesPath));

// Static serve the frontend id.html from root folder
// For any GET request that doesn't match an API route or file, serve id.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'id.html'));
});

// Mount API router
app.use('/api', require('./routes/api'));

// Health check endpoint (matches FastAPI /health)
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const { connectDB } = require('./db');

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
});
