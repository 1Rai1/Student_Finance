const express = require('express');
const router = express.Router();
const { register, getCustomToken, getCurrentUser, deleteAccount } = require('./auth-Controller');
const { verifyToken } = require('../Middleware/auth');
const { authLimiter } = require('../Middleware/rateLimiter');

// Public routes
router.post('/register', authLimiter, register);
router.post('/token', authLimiter, getCustomToken);   // login endpoint

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.delete('/delete', verifyToken, deleteAccount);

module.exports = router;