// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllUser,
    getUsersByQuery,
    getUserById,
    updateUser,
    deleteUser
} = require('./user-Controller');
const upload = require('../Middleware/upload')

const { verifyToken, verifyAdmin, verifyOwnership } = require('../Middleware/auth');
const { strictLimiter, readLimiter } = require('../Middleware/rateLimiter');

// ==========================================
// ADMIN ROUTES (Protected - Admin Only)
// ==========================================

// All admin routes require authentication + admin role
router.get('/admin/all', verifyToken, verifyAdmin, readLimiter, getAllUser);
router.get('/admin/query', verifyToken, verifyAdmin, readLimiter, getUsersByQuery);
router.get('/admin/:id', verifyToken, verifyAdmin, readLimiter, getUserById);
router.put('/admin/:id', verifyToken, verifyAdmin, upload.single('image'), strictLimiter, updateUser);
router.delete('/admin/:id', verifyToken, verifyAdmin, strictLimiter, deleteUser);

// ==========================================
// USER ROUTES (Protected - Self Only)
// ==========================================

// Users can only manage their own resources
router.get('/:id', verifyToken, verifyOwnership, readLimiter, getUserById);
router.put('/:id', verifyToken, verifyOwnership,upload.single('image'), strictLimiter, updateUser);
router.delete('/:id', verifyToken, verifyOwnership, strictLimiter, deleteUser);

module.exports = router;