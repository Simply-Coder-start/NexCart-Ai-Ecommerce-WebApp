// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Ensure uploads directory exists (created during setup)
const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Static serve the frontend id.html from root folder
// For any GET request that doesn't match an API route or file, serve id.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'id.html'));
});

// Basic structure for API routes (To be implemented in Phase 4)
// app.use('/api', require('./routes/api'));

// Health check endpoint (matches FastAPI /health)
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
