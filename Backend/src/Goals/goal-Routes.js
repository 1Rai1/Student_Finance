const express = require('express');
const router = express.Router()
const goalController = require('./goal-Controller')

//get the all goals
router.get('/', goalController.getAllGoals) 
//get them user with all their  motivations details
router.get('/user/:userId/details', goalController.getUserWithGoals)
//get user with motivationg with minimal detail
router.get('/user/:userId', goalController.getGoalsByUserId) 
//get specific motivation ahahah
router.get('/:id', goalController.getGoalById)
//create a motivation little one
router.post('/user/:userId', goalController.createGoal)
//update your motivation progress little one
router.post('/:goalId/progress', goalController.addProgress)//changed from id to goalId
//update your crypto lmmao
router.put('/:id', goalController.updateGoals)
//why woud you delete it?
router.delete('/:id', goalController.deleteGoal)

module.exports = router