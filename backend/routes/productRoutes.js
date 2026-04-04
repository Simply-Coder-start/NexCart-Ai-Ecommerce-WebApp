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
    const { q, category, minPrice, maxPrice, color, size } = req.query;
    
    let query = {};
    
    // Support category filtering
    if (category && category !== 'all') {
      query.category = category;
    }

    // Price range filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Color filtering
    if (color) {
      query.colors = color; // MongoDB matches if color is in the array
    }

    // Size filtering
    if (size) {
      query.sizes = size;
    }

    // Support text search or regex based on the query 'q'
    if (q) {
        query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { subcategory: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
        ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json(products.map(p => {
        p.id = p._id.toString();
        delete p._id;
        return p;
    }));
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Batch compare products (lightweight)
router.get('/compare', async (req, res) => {
  try {
    const idsParam = req.query.ids;

    // Validate: ids param must exist
    if (!idsParam || typeof idsParam !== 'string' || idsParam.trim() === '') {
      return res.status(400).json({ success: false, message: 'ids query parameter is required' });
    }

    const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);

    // Validate: 1-4 IDs only
    if (ids.length === 0 || ids.length > 4) {
      return res.status(400).json({ success: false, message: 'Provide between 1 and 4 product IDs' });
    }

    // Validate each ID is a valid ObjectId format
    const mongoose = require('mongoose');
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

    // Fetch only the fields needed for comparison (lightweight)
    const products = await Product.find(
      { _id: { $in: validIds } },
      'name image price originalPrice rating reviewCount inStock'
    ).lean();

    // Shape response
    const data = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      image: p.image,
      price: p.price,
      originalPrice: p.originalPrice || null,
      rating: p.rating,
      reviewCount: p.reviewCount,
      inStock: p.inStock !== undefined ? p.inStock : true,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
