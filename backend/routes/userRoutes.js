const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/user/update
router.put('/update', authMiddleware, [
    body('name').optional().trim().isLength({ min: 2 }),
    body('phone').optional().trim(),
    body('profile_image').optional().trim(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.phone) updates.phone = req.body.phone;
        if (req.body.profile_image) updates.profile_image = req.body.profile_image;

        const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/user/orders
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/user/address
router.post('/address', authMiddleware, async (req, res) => {
    try {
        const { street, city, state, zipCode, isDefault } = req.body;
        const newAddress = {
            id: Date.now().toString(),
            street, city, state, zipCode,
            isDefault: isDefault || false
        };

        const user = await User.findById(req.user.id);
        if (newAddress.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }
        user.addresses.push(newAddress);
        await user.save();

        res.json({ message: 'Address added', addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/user/address
router.put('/address', authMiddleware, async (req, res) => {
    try {
        const { id, street, city, state, zipCode, isDefault } = req.body;
        const user = await User.findById(req.user.id);

        const addr = user.addresses.find(a => a.id === id);
        if (!addr) return res.status(404).json({ message: 'Address not found' });

        if (isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }

        addr.street = street || addr.street;
        addr.city = city || addr.city;
        addr.state = state || addr.state;
        addr.zipCode = zipCode || addr.zipCode;
        addr.isDefault = isDefault !== undefined ? isDefault : addr.isDefault;

        await user.save();
        res.json({ message: 'Address updated', addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE /api/user/address
router.delete('/address', authMiddleware, async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(a => a.id !== id);
        await user.save();
        res.json({ message: 'Address deleted', addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/user/change-password
router.put('/change-password', authMiddleware, [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 })
], async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password_hash');

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Current password incorrect' });

        user.password_hash = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
