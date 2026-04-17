const express = require('express');
const router = express.Router()
const goalController = require('./goal-Controller')
const { strictLimiter, readLimiter } = require('./../Middleware/rateLimiter')
const { verifyToken, verifyAdmin, verifyOwnership } = require('../Middleware/auth');

//get all goals (admin only)
router.get('/', verifyToken, verifyAdmin, readLimiter, goalController.getAllGoals)

//get user with goals details
router.get('/user/:userId/details', verifyToken, verifyOwnership, readLimiter, goalController.getUserWithGoals)

//get user goals minimal
router.get('/user/:userId', verifyToken, verifyOwnership, readLimiter, goalController.getGoalsByUserId)

//get specific goal
router.get('/:goalId', verifyToken, verifyOwnership, readLimiter, goalController.getGoalById)

//create goal
router.post('/user/:userId', verifyToken, strictLimiter, goalController.createGoal)

//add progress (use only verifyToken – ownership check can be added later)
router.post('/:goalId/progress', verifyToken, strictLimiter, goalController.addProgress)

//update goal
router.put('/:goalId', verifyToken, verifyOwnership, strictLimiter, goalController.updateGoals)

//delete goal
router.delete('/:goalId', verifyToken, verifyOwnership, strictLimiter, goalController.deleteGoal)

module.exports = router