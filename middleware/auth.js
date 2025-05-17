const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Vendor = require('../models/vendor');

// Authentication middleware
// this Middleware function checks if user is authenticated
const auth = async (req, res, next) => {
  try {
    // extract the token from the request headers
    const token = req.header('x-auth-token');
    // if no token is provided , return 401 (unauthorized) response
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // verify the jwt token using the secret key
    const verified = jwt.verify(token, 'passwordKey');

    // if the token verification failed, return 401
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, authorization denied' });
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

    // attach the authenticated user 
    req.user = user;
    req.user.role = role; // Add role explicitly for further use
    req.token = token;

    // proceed to next middleware or router handler
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

    // if the user is a vendor, proceed to the next middleware or route handler
    next();
  } catch (e) {
    console.error('VendorAuth error:', e.message);
    res.status(500).json({ error: 'Internal server error in vendorAuth middleware' });
  }
};

module.exports = { auth, vendorAuth };