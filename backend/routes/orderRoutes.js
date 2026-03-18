const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { generateInvoicePDF } = require('../services/invoiceGenerator');

// POST /api/orders/create
router.post('/create', authMiddleware, async (req, res) => {
    console.log(`[ORDER] Create request from user: ${req.user.id}`);
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addresses = user.addresses || [];
        const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

        if (!defaultAddress) {
            return res.status(400).json({ message: 'No shipping address found. Please add one in your profile before checking out.' });
        }

        const subtotal = cart.items.reduce((s, i) => s + (i.price * i.quantity), 0);
        const tax = subtotal * 0.18;
        const totalPrice = subtotal + tax; // Should also handle discounts if any

        // Generate a random Order ID
        const orderId = 'NC' + Date.now().toString().slice(-8);

        const newOrder = new Order({
            orderId,
            userId,
            items: cart.items.map(i => ({
                productId: i.productId,
                productName: i.productName,
                productImage: i.productImage,
                price: i.price,
                quantity: i.quantity
            })),
            totalPrice,
            status: 'Pending',
            expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            shippingAddress: {
                street: defaultAddress.street || '',
                city: defaultAddress.city || '',
                state: defaultAddress.state || '',
                zipCode: defaultAddress.zipCode || ''
            }
        });

        await newOrder.save();

        // Clear the cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET /api/orders/my-orders
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/orders/:orderId
router.get('/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId, userId: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/orders/invoice/:orderId
router.get('/invoice/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId, userId: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const user = await User.findById(req.user.id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice_${order.orderId}.pdf`);

        generateInvoicePDF(order, user, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
