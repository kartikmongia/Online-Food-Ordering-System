const Review = require('../models/Review');

// ➤ Add a new review
exports.addReview = async (req, res) => {
  const { restaurantId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Prevent duplicate reviews per user
    const existing = await Review.findOne({ userId: req.user._id, restaurantId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this restaurant' });
    }

    const review = new Review({
      userId: req.user._id,
      restaurantId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
  console.error('🔥 Review Add Error:', err);  // Add this
  res.status(500).json({ message: 'Error adding review', error: err.message });  // Add err.message to response
  }
};

// ➤ Get all reviews for a restaurant
exports.getReviewsForRestaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  try {
    const reviews = await Review.find({ restaurantId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};
