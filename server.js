const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);

app.use('/api/reviews', require('./routes/reviewRoutes'));

const connectDB = require('./config/db');
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
