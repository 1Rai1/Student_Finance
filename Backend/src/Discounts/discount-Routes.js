const express = require('express')
const router = express.Router()
const upload = require('../Middleware/upload')
const discountController = require('./discount-Controller')
const { verifyToken, verifyAdmin, verifyOwnership } = require('../Middleware/auth');
const { strictLimiter, readLimiter } = require('../Middleware/rateLimiter');

// Get all posts 
router.get('/',readLimiter, discountController.getAllDiscount);
// Get single post
router.get('/:postId',readLimiter, discountController.getDiscountById);
// Get messages for a post
router.get('/:postId/messages',readLimiter, discountController.getPostMessages);
// Create post (title, description, location, optional image)
router.post('/user/:userId',strictLimiter, upload.single('image'), discountController.createDiscount);
// Like a post
router.post('/:postId/like',strictLimiter, discountController.likePost);
// Save a post
router.post('/:postId/save',strictLimiter, discountController.savePost);
// Vote on post (real or fake)
router.post('/:postId/vote',strictLimiter, discountController.voteOnPost);
// Add comment
router.post('/:postId/message',strictLimiter,discountController.addMessage);
// Delete post
router.delete('/:postId',verifyOwnership,strictLimiter, discountController.deleteDiscount);

module.exports = router;
