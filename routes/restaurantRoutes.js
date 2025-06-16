const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  addRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');

const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Admin-only routes
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('cuisine').notEmpty().withMessage('Cuisine is required'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addRestaurant
);

router.put('/:id', protect, adminOnly, updateRestaurant);
router.delete('/:id', protect, adminOnly, deleteRestaurant);

module.exports = router;
