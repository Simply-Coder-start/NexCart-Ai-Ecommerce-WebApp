const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// POST /api/cart/add
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity, color, protectionPlan } = req.body;

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

module.exports = router;
