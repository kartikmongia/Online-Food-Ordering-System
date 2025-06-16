const CartItem = require('../models/CartItem');
const MenuItem = require('../models/MenuItem');

// Add item to cart
exports.addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // If item already in cart, update quantity
    let existing = await CartItem.findOne({ userId, menuItemId });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await CartItem.create({ userId, menuItemId, quantity });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id }).populate('menuItemId');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// Delete item from cart
exports.removeFromCart = async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item' });
  }
};
