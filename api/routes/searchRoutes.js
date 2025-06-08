// backend/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { searchAll } = require('../services/searchService');

router.get('/', protect, async (req, res) => {
    const { query, platforms, dateRange } = req.query;

    try {
        const results = await searchAll({
            query: query || '',
            platforms: platforms ? platforms.split(',') : ['twitter', 'telegram', 'eitaa'],
            dateRange
        }, req); // Pass the `req` object here
        res.json(results);
    } catch (error) {
        console.error('Search route error:', error);
        res.status(500).json({ message: 'خطا در پردازش جستجو', error: error.message });
    }
});

module.exports = router;