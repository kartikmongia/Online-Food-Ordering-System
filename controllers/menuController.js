const MenuItem = require('../models/MenuItem');

// Add item to restaurant menu (admin only)
exports.addMenuItem = async (req, res) => {
  const { restaurantId, name, description, price, category } = req.body;

  try {
    const newItem = await MenuItem.create({
      restaurantId,
      name,
      description,
      price,
      category,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add menu item' });
  }
};

// Get menu items for a restaurant
exports.getMenuByRestaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || '';

  try {
    const query = {
      restaurantId,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await MenuItem.countDocuments(query);

    const items = await MenuItem.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: items,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};



// Delete a menu item (admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
};
