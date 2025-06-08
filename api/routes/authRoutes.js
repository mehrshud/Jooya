// api/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this model path is correct
const { protect, admin } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] Received login request for email: ${email}`); // DEBUG 1

    const user = await User.findOne({ email });

    if (user) {
        console.log(`[LOGIN ATTEMPT] Found user: ${user.email}`); // DEBUG 2
        
        const isMatch = await user.matchPassword(password);
        console.log(`[LOGIN ATTEMPT] Password match result: ${isMatch}`); // DEBUG 3

        if (isMatch) {
            console.log(`[LOGIN ATTEMPT] Success! Generating token.`); // DEBUG 4
            res.json({
              _id: user._id,
              email: user.email,
              role: user.role,
              token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('ایمیل یا رمز عبور نامعتبر است');
        }

    } else {
        console.log(`[LOGIN ATTEMPT] User not found with email: ${email}`);
        res.status(401);
        throw new Error('ایمیل یا رمز عبور نامعتبر است');
    }
  })
);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Admin
router.post(
  '/register',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('کاربر با این ایمیل در سیستم موجود است');
    }

    const user = await User.create({
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('اطلاعات کاربر نامعتبر است');
    }
  })
);


module.exports = router;