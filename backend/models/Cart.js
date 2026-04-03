const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  selected: {
    type: Boolean,
    default: true,
  },
  saveForLater: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  items: [CartItemSchema],
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { 
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Method to calculate total items
CartSchema.methods.getTotalItems = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Method to calculate total price (only selected active items)
CartSchema.methods.getTotalPrice = function() {
  return this.items.reduce((total, item) => {
    if (item.selected && !item.saveForLater) {
      return total + (item.price * item.quantity);
    }
    return total;
  }, 0);
};

// Transform to clean JSON
CartSchema.set('toJSON', {
  transform: function(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Cart', CartSchema);
