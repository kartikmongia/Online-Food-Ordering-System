const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review'); // ✅ Required for ratings aggregation


// Add a new restaurant (admin only)
exports.addRestaurant = async (req, res) => {
  const { name, cuisine, address } = req.body;

  try {
    const restaurant = await Restaurant.create({ name, cuisine, address });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add restaurant' });
  }
};

// Get all restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 5; // Default 5 per page
    const search = req.query.search || '';

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },       // case-insensitive name match
        { cuisine: { $regex: search, $options: 'i' } }     // case-insensitive cuisine match
      ]
    };

    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
       .lean(); // Convert to plain JS object to add custom fields
       for (let rest of restaurants) {
  const reviews = await Review.find({ restaurantId: rest._id });
  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;
  rest.avgRating = avgRating;
}

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: restaurants,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurants' });
  }
};


// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurant' });
  }
};

// Update restaurant (admin only)
exports.updateRestaurant = async (req, res) => {
  const { name, cuisine, address } = req.body;

  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { name, cuisine, address },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// Delete restaurant (admin only)
exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};
