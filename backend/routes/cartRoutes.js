const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/cart/add - Add item to cart
router.post('/add', authMiddleware, [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('productImage').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { productId, productName, price, quantity = 1, productImage = '' } = req.body;
    const userId = req.user.id;

    // Find or create cart for this user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        items: [{
          productId,
          productName,
          productImage,
          price,
          quantity,
        }]
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

      if (existingItemIndex > -1) {
        // Product exists, increase quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Product doesn't exist, add new item
        cart.items.push({
          productId,
          productName,
          productImage,
          price,
          quantity,
        });
      }
    }

    await cart.save();

    return res.status(200).json({
      message: 'Item added to cart',
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotalPrice(),
      }
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// GET /api/cart - Get user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Return empty cart if none exists
      return res.status(200).json({
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        }
      });
    }

    return res.status(200).json({
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotalPrice(),
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// PUT /api/cart/update - Update item quantity
router.put('/update', authMiddleware, [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
], async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });

    if (quantity === 0) cart.items.splice(itemIndex, 1);
    else cart.items[itemIndex].quantity = quantity;

    await cart.save();
    return res.status(200).json({
      message: 'Cart updated',
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotalPrice(),
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/cart/toggle-select - Toggle item selection
router.put('/toggle-select', authMiddleware, [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
  body('selected').isBoolean().withMessage('Selected must be a boolean'),
], async (req, res) => {
  try {
    const { productId, selected } = req.body;
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });

    cart.items[itemIndex].selected = selected;
    await cart.save();

    return res.status(200).json({
      message: 'Selection updated',
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotalPrice(),
      }
    });
  } catch (error) {
    console.error('Toggle selection error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/cart/toggle-save-later - Move item between active and saved later
router.put('/toggle-save-later', authMiddleware, [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
  body('saveForLater').isBoolean().withMessage('saveForLater must be a boolean'),
], async (req, res) => {
  try {
    const { productId, saveForLater } = req.body;
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Product not found in cart' });

    cart.items[itemIndex].saveForLater = saveForLater;
    // If moving to saved later, deselect it just in case
    if (saveForLater) cart.items[itemIndex].selected = false;
    else cart.items[itemIndex].selected = true; // Auto-select when moving back to cart

    await cart.save();

    return res.status(200).json({
      message: saveForLater ? 'Moved to Save for Later' : 'Moved back to Cart',
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotalPrice(),
      }
    });
  } catch (error) {
    console.error('Toggle save for later error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove', authMiddleware, [
  body('productId').trim().notEmpty().withMessage('Product ID is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res.status(200).json({
      message: 'Item removed from cart',
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotalPrice(),
      }
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

module.exports = router;
