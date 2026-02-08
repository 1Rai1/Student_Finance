const express = require('express');
const router = express.Router();
const goalController = require('./goalController');

router.post('/', goalController.createGoals);
router.get('/:id', goalController.getGoalById);
router.put('/:id', goalController.updateGoals);
router.delete('/:id', goalController.deleteGoals);

module.exports = router;