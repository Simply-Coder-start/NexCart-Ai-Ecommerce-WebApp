const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    badge: { type: String },
    tryOnEligible: { type: Boolean, default: false },
    image: { type: String },
    colors: { type: [String], default: [] },
    isNew: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
