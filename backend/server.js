const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://accounts.google.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://accounts.google.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://upload.wikimedia.org"],
      connectSrc: ["'self'", "https://unpkg.com", "https://accounts.google.com", "https://images.unsplash.com", "https://upload.wikimedia.org"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://unpkg.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: false }));
app.use(express.json({ limit: '1mb' }));

// express-mongo-sanitize's default middleware sets req.query which is
// read-only in Express 5, so sanitize only req.body and req.params manually.
app.use((req, _res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  next();
});

// === API ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tryon', aiRoutes);

// === STATIC SERVING ===
const uploadsPath = path.join(__dirname, '..', 'uploads');
const frontendPath = path.join(__dirname, '..', 'frontend');
const imagesPath = path.join(frontendPath, 'images');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

app.use('/uploads', express.static(uploadsPath));
app.use('/images', express.static(imagesPath));
app.use(express.static(frontendPath));

// === API ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);

// Root route serves the main frontend page
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'id.html'));
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  return res.status(500).json({ message: 'Unhandled error', error: err.message });
});

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in .env');
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace_with_a_long_random_secret') {
      throw new Error('JWT_SECRET must be set to a strong secret in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });

    app.listen(PORT, () => {
      console.log(`NexCart Consolidated Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Startup error:', error.message);
    process.exit(1);
  }
}

startServer();
