const express = require('express')
const router = express.Router()
const upload = require('../Middleware/upload')
const discountController = require('./discount-Controller')

// Get all posts 
router.get('/', discountController.getAllDiscount);
// Get single post
router.get('/:postId', discountController.getDiscountById);
// Get messages for a post
router.get('/:postId/messages', discountController.getPostMessages);
// Create post (title, description, location, optional image)
router.post('/user/:userId', upload.single('image'), discountController.createDiscount);
// Like a post
router.post('/:postId/like', discountController.likePost);
// Save a post
router.post('/:postId/save', discountController.savePost);
// Vote on post (real or fake)
router.post('/:postId/vote', discountController.voteOnPost);
// Add comment
router.post('/:postId/message',discountController.addMessage);
// Delete post
router.delete('/:postId', discountController.deleteDiscount);

module.exports = router;
