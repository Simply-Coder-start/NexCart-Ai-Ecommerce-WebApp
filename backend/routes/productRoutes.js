const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    return res.status(200).json(products.map(p => {
        p.id = p._id.toString();
        delete p._id;
        return p;
    }));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    
    let query = {};
    
    // Support category filtering
    if (category && category !== 'all') {
      query.category = category;
    }

    // Support text search or regex based on the query 'q'
    if (q) {
        query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { subcategory: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
        ];
    }

    const products = await Product.find(query).lean();
    return res.status(200).json(products.map(p => {
        p.id = p._id.toString();
        delete p._id;
        return p;
    }));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.id = product._id.toString();
    delete product._id;
    return res.status(200).json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
