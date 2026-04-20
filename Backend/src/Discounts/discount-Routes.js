const express = require('express')
const router = express.Router()
const upload = require('../Middleware/upload')
const discountController = require('./discount-Controller')
const { verifyToken, verifyAdmin, verifyOwnership } = require('../Middleware/auth');
const { strictLimiter, readLimiter } = require('../Middleware/rateLimiter');

// Public routes (read only)
router.get('/', readLimiter, discountController.getAllDiscount);
router.get('/search', readLimiter, discountController.filterPost);
router.get('/:postId', readLimiter, discountController.getDiscountById);
router.get('/:postId/messages', readLimiter, discountController.getPostMessages);

// Protected routes (require authentication)
router.post('/user/:userId', verifyToken, strictLimiter, upload.single('image'), discountController.createDiscount);
router.post('/:postId/like', verifyToken, strictLimiter, discountController.likePost);
router.post('/:postId/save', verifyToken, strictLimiter, discountController.savePost);
router.post('/:postId/vote', verifyToken, strictLimiter, discountController.voteOnPost);
router.post('/:postId/message', verifyToken, strictLimiter, discountController.addMessage);
router.delete('/:postId', verifyToken, strictLimiter, discountController.deleteDiscount); // ownership check optional

module.exports = router;