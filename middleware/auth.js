const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Vendor = require('../models/vendor');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const verified = jwt.verify(token, 'passwordKey');
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    // Try finding user first
    let user = await User.findById(verified.id);
    let role = 'user';

    // If not found, try finding vendor
    if (!user) {
      user = await Vendor.findById(verified.id);
      role = 'vendor';
    }

    if (!user) {
      return res.status(401).json({ message: 'User or Vendor not found, authorization denied' });
    }

    req.user = user;
    req.user.role = role; // Add role explicitly for further use
    req.token = token;

    next();
  } catch (e) {
    console.error('Auth middleware error:', e.message);
    res.status(500).json({ error: 'Internal server error in auth middleware' });
  }
};

// Vendor-only access middleware
const vendorAuth = (req, res, next) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Access denied, only vendors are allowed' });
    }
    next();
  } catch (e) {
    console.error('VendorAuth error:', e.message);
    res.status(500).json({ error: 'Internal server error in vendorAuth middleware' });
  }
};

module.exports = { auth, vendorAuth };