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

        // Generate a random Tracking ID
        const trackingId = 'TRK' + Math.random().toString(36).substring(2, 10).toUpperCase();

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
            status: 'Placed',
            trackingId,
            paymentMethod: req.body.paymentMethod || 'UPI',
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

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
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

// GET /api/orders/:orderId/track
router.get('/:orderId/track', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId, userId: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Mock tracking milestones
        const milestones = [
            { status: 'Placed', date: order.createdAt, message: 'Order placed successfully' },
            { status: 'Processing', date: new Date(order.createdAt.getTime() + 12 * 3600000), message: 'Order is being processed' },
        ];

        if (['Shipped', 'Delivered'].includes(order.status)) {
            milestones.push({ status: 'Shipped', date: new Date(order.createdAt.getTime() + 24 * 3600000), message: 'Order has been shipped' });
        }
        
        if (order.status === 'Delivered') {
            milestones.push({ status: 'Delivered', date: order.deliveryDate || new Date(order.createdAt.getTime() + 48 * 3600000), message: 'Order delivered' });
        }

        res.json({ status: order.status, trackingId: order.trackingId, milestones });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/orders/:orderId/return
router.post('/:orderId/return', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId, userId: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.status !== 'Delivered') {
            return res.status(400).json({ message: 'Only delivered items can be returned' });
        }

        // Return Eligibility check: 7 days window
        const deliveryDate = order.deliveryDate || order.expectedDeliveryDate;
        const diffDays = Math.ceil(Math.abs(Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
            return res.status(400).json({ message: 'Return window closed (items can be returned within 7 days of delivery)' });
        }

        order.status = 'Returned';
        await order.save();

        res.json({ message: 'Return initiated successfully', status: 'Returned' });
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
        res.status(500).json({ message: 'Invoice generation failed', error: err.message });
    }
});

module.exports = router;
