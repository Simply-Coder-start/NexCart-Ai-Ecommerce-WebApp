const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/nexcart', {
  // Use standard mongoose 6+ configuration
})
.then(() => console.log('✅ MongoDB successfully connected to nexcart'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/cart', cartRoutes);

// Blueprint Wishlist route (placeholder)
app.post('/api/wishlist/add', (req, res) => {
  console.log("Wishlist request received:", req.body);
  res.status(200).json({ message: "Added to wishlist 💜", data: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
