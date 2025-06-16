const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Place an order
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await CartItem.find({ userId }).populate('menuItemId');

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cartItems.map(item => ({
      menuItemId: item.menuItemId._id,
      quantity: item.quantity,
    }));

    const totalAmount = cartItems.reduce((sum, item) =>
      sum + item.menuItemId.price * item.quantity, 0);

    const order = await Order.create({
      userId,
      items,
      totalAmount,
    });

    // Clear cart
    await CartItem.deleteMany({ userId });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// Get user orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.menuItemId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
