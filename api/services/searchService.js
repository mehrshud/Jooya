// backend/services/searchService.js
const _ = require('lodash');
const Post = require('../models/Post');
const { searchTweets, transformTweet } = require('./twitterService');
const { searchEitaa, transformEitaaMessage } = require('./eitaaService');

const fetchAndStore = async (platform, fetchFunction, transformFunction, query, io) => { // Added `io`
    try {
        const rawData = await fetchFunction(query);
        const transformedPosts = rawData.map(transformFunction);

        if (transformedPosts.length === 0) return;

        const operations = transformedPosts.map(post => ({
            updateOne: {
                filter: { postId: post.postId },
                update: { $set: post },
                upsert: true
            }
        }));

        const result = await Post.bulkWrite(operations, { ordered: false });
        
        const changeCount = result.upsertedCount + result.modifiedCount;
        if (changeCount > 0) {
            console.log(`[${platform}] Stored/updated ${changeCount} posts.`);
            // Emit event to all connected clients
            io.emit('new_data_available', { platform, count: result.upsertedCount });
        }
    } catch (error) {
        console.error(`Error during fetch/store for ${platform}:`, error.message);
    }
};

const searchAll = async ({ query, platforms, dateRange }, req) => {
    const io = req.io; // Get the io instance from the request object
    const fetchPromises = [];

    if (platforms.includes('twitter') && query) {
        fetchPromises.push(fetchAndStore('twitter', () => searchTweets(query), transformTweet, query, io));
    }
    if (platforms.includes('eitaa') && query) {
        fetchPromises.push(fetchAndStore('eitaa', () => searchEitaa(query), transformEitaaMessage, query, io));
    }
    
    await Promise.all(fetchPromises);
    
    let dbQuery = {};
    if (query) {
        dbQuery.$text = { $search: query };
    }
    if (platforms && platforms.length > 0) {
        dbQuery.platform = { $in: platforms };
    }

    const results = await Post.find(dbQuery)
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();

    return results;
}

module.exports = { searchAll };