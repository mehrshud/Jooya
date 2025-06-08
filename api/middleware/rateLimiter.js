// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General limiter for most API calls.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  // Allows the limiter to trust the X-Forwarded-For header set by proxies like Nginx or Vercel
  trustProxy: 1, 
});

module.exports = { apiLimiter };