const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    badge: {
      type: String,
      default: null,
    },
    tryOnEligible: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true, // adds createdAt and updatedAt
    suppressReservedKeysWarning: true,
  }
);

// Add index for search functionality
ProductSchema.index({ name: 'text', category: 'text', subcategory: 'text' });

ProductSchema.set('toJSON', {
  transform: function (_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Product', ProductSchema);
