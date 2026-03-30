const express = require('express')
const router = express.Router()
const userController = require('./user-Controller')
const checkAdmin = require('./../Middleware/checkAdmin') 

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post('/create', userController.createUser);  // Anyone can register

// ==========================================
// ADMIN ROUTES (Protected)
// ==========================================
router.get('/admin/:adminId/all', checkAdmin, userController.getAllUser);
router.get('/admin/:adminId/query', checkAdmin, userController.getUsersByQuery);
router.get('/admin/:adminId/user/:id', checkAdmin, userController.getUserById);
router.put('/admin/:adminId/user/:id', checkAdmin, userController.updateUser);
router.delete('/admin/:adminId/user/:id', checkAdmin, userController.deleteUser);

// ==========================================
// USER ROUTES (Self-management)
// ==========================================
router.get('/:id', userController.getUserById);       // View own profile
router.put('/:id', userController.updateUser);        // Update own profile
router.delete('/:id', userController.deleteUser);     // Delete own account

module.exports = router