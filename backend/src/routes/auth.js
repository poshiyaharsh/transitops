const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    
    // For development: If no user exists, create one (so the user can login immediately)
    if (!user) {
      if (email === 'vrajpopat47@gmail.com' && password === 'admin123') {
        user = await User.create({
          name: 'Vraj Popat',
          email,
          password,
          role: 'admin'
        });
      } else if (email === 'admin@transitops.com' && password === 'admin123') {
        user = await User.create({
          name: 'Admin User',
          email,
          password,
          role: 'admin'
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = router;
