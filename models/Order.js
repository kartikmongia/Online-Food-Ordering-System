const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
      },
      quantity: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
