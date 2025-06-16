const express = require('express');
const router = express.Router();
const { addReview, getReviewsForRestaurant } = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');

// ➤ User adds a review
router.post('/', protect, addReview);

// ➤ Public gets reviews of a restaurant
router.get('/:restaurantId', getReviewsForRestaurant);

module.exports = router;
