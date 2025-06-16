const express = require('express');
const { placeOrder, getOrders ,updateOrderStatus} = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const adminOnly = require('../middleware/adminMiddleware');




// User must be logged in
router.post('/', protect, placeOrder);
router.get('/', protect, getOrders);


// Update order status (Admin only)
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
