const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  addMenuItem,
  getMenuByRestaurant,
  deleteMenuItem,
} = require('../controllers/menuController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

const router = express.Router();

// Public: View menu
router.get('/:restaurantId', getMenuByRestaurant);

// Admin-only: Add/delete menu items
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
    body('name').notEmpty().withMessage('Item name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addMenuItem
);

router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
