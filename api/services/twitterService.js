// backend/services/twitterService.js
const axios = require('axios');
const _ = require('lodash');

const tokens = (process.env.TWITTER_BEARER_TOKENS || '').split(',').map(t => t.trim()).filter(Boolean);
let currentTokenIndex = 0;

const searchTweets = async (query, maxResults = 15) => {
    if (tokens.length === 0) {
        throw new Error('Twitter service is unavailable: No API tokens are configured.');
    }

    const TWITTER_API_URL = 'https://api.twitter.com/2/tweets/search/recent';
    const params = {
        'query': `${query} -is:retweet lang:fa`,
        'max_results': _.clamp(maxResults, 10, 100),
        'tweet.fields': 'created_at,author_id,public_metrics,lang,text',
        'expansions': 'author_id',
        'user.fields': 'name,username,profile_image_url',
    };
    
    // Simple token rotation stub. A real implementation would be more robust.
    const token = tokens[currentTokenIndex];
    currentTokenIndex = (currentTokenIndex + 1) % tokens.length;

    try {
        const response = await axios.get(TWITTER_API_URL, {
            headers: { 'Authorization': `Bearer ${token}` },
            params,
        });
        
        const userMap = _.keyBy(response.data?.includes?.users || [], 'id');
        return (response.data?.data || []).map(tweet => ({ ...tweet, _userMap: userMap })); // Pass user map along with tweet
    } catch (error) {
        console.error(`Twitter API request failed with token index ${currentTokenIndex}: ${error.message}`);
        throw new Error('Failed to fetch from Twitter.');
    }
};

const transformTweet = (tweet) => {
    const author = tweet._userMap[tweet.author_id] || {};
    return {
        postId: `tw-${tweet.id}`,
        platform: 'twitter',
        content: tweet.text,
        author: {
            name: author.name || 'Unknown User',
            username: author.username || 'unknownuser',
            avatar: author.profile_image_url?.replace('_normal', '_bigger') || null,
        },
        url: `https://twitter.com/${author.username || 'anyuser'}/status/${tweet.id}`,
        timestamp: new Date(tweet.created_at),
        metrics: {
            likes: _.get(tweet, 'public_metrics.like_count', 0),
            comments: _.get(tweet, 'public_metrics.reply_count', 0),
            shares: _.get(tweet, 'public_metrics.retweet_count', 0),
        },
    };
}

module.exports = { searchTweets, transformTweet };