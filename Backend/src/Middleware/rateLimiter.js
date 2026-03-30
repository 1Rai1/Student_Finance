// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// General API rate limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Strict limiter for create/update/delete - 20 requests per 15 minutes
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: {
        success: false,
        message: 'Too many create/update/delete requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login/register limiter - 5 requests per 15 minutes (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 login/register attempts per windowMs
    message: {
        success: false,
        message: 'Too many account creation attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Read-only limiter - 200 requests per 15 minutes (more lenient for GET)
const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: 'Too many read requests, please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    generalLimiter,
    strictLimiter,
    authLimiter,
    readLimiter
};