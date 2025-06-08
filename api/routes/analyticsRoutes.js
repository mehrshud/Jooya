// backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');
const { getSentimentDistribution, getPostStats } = require('../services/analyticsService');

// @desc    Get dashboard analytics overview
// @route   GET /api/analytics/overview
// @access  Private
router.get('/overview', protect, asyncHandler(async (req, res) => {
  const [sentimentDistribution, postStats] = await Promise.all([
    getSentimentDistribution(),
    getPostStats(),
  ]);

  res.json({
    sentimentDistribution,
    ...postStats
  });
}));

module.exports = router;