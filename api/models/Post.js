// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    postId: { type: String, required: true, unique: true }, // e.g., 'tw-12345'
    platform: { type: String, required: true, index: true }, // e.g., 'twitter', 'telegram', 'eitaa'
    content: { type: String, required: true },
    author: {
        name: String,
        username: String,
        avatar: String,
    },
    url: String,
    timestamp: { type: Date, required: true, index: true },
    metrics: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
    },
    aiAnalysis: {
        sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral'},
        emotion: String,
        explanation: String,
        language: String,
        translation: String
    }
  },
  {
    timestamps: true,
  }
);

// To improve search performance
postSchema.index({ content: 'text', 'author.name': 'text', 'author.username': 'text' });


const Post = mongoose.model('Post', postSchema);
module.exports = Post;