// backend/services/analyticsService.js
const Post = require('../models/Post');

// @desc    Get sentiment distribution for charts
const getSentimentDistribution = async () => {
  const distribution = await Post.aggregate([
    { $group: { _id: '$aiAnalysis.sentiment', count: { $sum: 1 } } },
    { $project: { id: '$_id', value: '$count', label: '$_id', _id: 0 } }
  ]);

  const sentimentMap = {
      positive: "مثبت",
      neutral: "خنثی",
      negative: "منفی"
  };

  const results = ['positive', 'neutral', 'negative'].map(sentiment => {
    const found = distribution.find(d => d.id === sentiment);
    return {
      id: sentiment,
      value: found ? found.value : 0,
      label: sentimentMap[sentiment] || sentiment
    };
  });

  return results;
};

// @desc Get basic post statistics
const getPostStats = async () => {
    const totalPosts = await Post.countDocuments();
    return { totalPosts };
}

module.exports = {
  getSentimentDistribution,
  getPostStats,
};