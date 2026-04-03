const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    productImage: String,
    price: Number,
    quantity: Number
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    items: [OrderItemSchema],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Placed'
    },
    paymentMethod: {
        type: String,
        default: 'UPI'
    },
    trackingId: {
        type: String,
        unique: true,
        required: true
    },
    expectedDeliveryDate: {
        type: Date
    },
    deliveryDate: {
        type: Date
    },
    returnEligible: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

OrderSchema.set('toJSON', {
    transform: function (_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
    }
});

module.exports = mongoose.model('Order', OrderSchema);
