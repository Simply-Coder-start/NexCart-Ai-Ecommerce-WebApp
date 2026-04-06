const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // Using String to prevent BSON casting issues with placeholder front-end IDs
  userId: { type: String, required: true }, 
  items: [{
    productId: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    color: { type: String },
    protectionPlan: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
