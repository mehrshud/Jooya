// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
}));

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Prevent admin from deleting themselves
        if(req.user._id.equals(user._id)){
            res.status(400);
            throw new Error('شما نمی‌توانید حساب کاربری خودتان را حذف کنید.');
        }
        await user.deleteOne();
        res.json({ message: 'کاربر با موفقیت حذف شد' });
    } else {
        res.status(404);
        throw new Error('کاربر یافت نشد');
    }
}));

module.exports = router;