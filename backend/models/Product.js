const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    default: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  images: [String],
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  colors: [String],
  sizes: [String],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  countInStock: {
    type: Number,
    required: [true, 'Stock count is required'],
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
