const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/authMiddleware');

// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// POST /api/cart/add
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity, color, protectionPlan } = req.body;
    const userId = req.userId;

    // 1. Check if user already has a cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // 2. If cart exists, check if this EXACT item (same product & color) is already in it
      const itemIndex = cart.items.findIndex(p => String(p.productId) === String(productId) && p.color === color);

      if (itemIndex > -1) {
        // If it exists, just update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If it doesn't exist, push the new item
        cart.items.push({ productId, quantity, color, protectionPlan });
      }
      cart = await cart.save();
      return res.status(200).json(cart);
      
    } else {
      // 3. If no cart exists for user, create a new one
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity, color, protectionPlan }]
      });
      return res.status(201).json(newCart);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding to cart" });
  }
});

// GET /api/cart/count
router.get('/count', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    
    if (!cart) {
      return res.json({ count: 0 });
    }

    // Calculate total quantity of all items in the cart
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ count: totalItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart count" });
  }
});

// PATCH /api/cart/update
router.patch('/update', auth, async (req, res) => {
  try {
    const { productId, quantity, color } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(p => String(p.productId) === String(productId) && p.color === color);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating cart" });
  }
});

// DELETE /api/cart/remove
router.delete('/remove', auth, async (req, res) => {
  try {
    const { productId, color } = req.body;
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(p => !(String(p.productId) === String(productId) && p.color === color));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart" });
  }
});

module.exports = router;
