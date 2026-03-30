// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, getCurrentUser, deleteAccount } = require('./auth-Controller');
const { verifyToken } = require('../Middleware/auth');
const { authLimiter } = require('../Middleware/rateLimiter');

// Public routes
router.post('/register', authLimiter, register);

// Protected routes (require authentication)
router.get('/me', verifyToken, getCurrentUser);
router.delete('/delete', verifyToken, deleteAccount);

module.exports = router;