const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  addToCart,
  getCart,
  removeFromCart,
} = require('../controllers/cartController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

// User must be logged in
router.post(
  '/',
  protect,
  [
    body('menuItemId').notEmpty().withMessage('Menu item ID is required'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addToCart
);

router.get('/', protect, getCart);
router.delete('/:id', protect, removeFromCart);

module.exports = router;
