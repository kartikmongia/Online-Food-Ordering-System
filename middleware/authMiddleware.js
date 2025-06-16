const jwt = require('jsonwebtoken');
const User = require('../models/User');  // ✅ Required to fetch full user

const protect = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // ✅ Fetch full user from DB

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;  // ✅ Now req.user._id will work
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
