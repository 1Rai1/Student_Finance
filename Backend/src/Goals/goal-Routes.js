const express = require('express');
const router = express.Router()
const goalController = require('./goal-Controller')
const {strictLimiter, readLimiter} = require('./../Middleware/rateLimiter')
const {verifyAdmin, verifyOwnership } = require('../Middleware/auth');


//get the all goals
router.get('/',verifyAdmin,readLimiter, goalController.getAllGoals) 
//get them user with all their  motivations details
router.get('/user/:userId/details',verifyOwnership,readLimiter, goalController.getUserWithGoals)
//get user with motivationg with minimal detail
router.get('/user/:userId',verifyOwnership,readLimiter, goalController.getGoalsByUserId) 
//get specific motivation ahahah
router.get('/:goalId',verifyOwnership,readLimiter, goalController.getGoalById)
//create a motivation little one
router.post('/user/:userId',strictLimiter, goalController.createGoal)
//update your motivation progress little one
router.post('/:goalId/progress',verifyOwnership,strictLimiter, goalController.addProgress)
//update your crypto lmmao
router.put('/:goalId',verifyOwnership,strictLimiter, goalController.updateGoals)
//why woud you delete it?
router.delete('/:goalId',verifyOwnership,strictLimiter, goalController.deleteGoal)

module.exports = router