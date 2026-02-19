const express = require('express')
const router = express.Router()
const expenseController = require('./expense-Controller')
const { route } = require('../Goals/goal-Routes')

//get all expenses
router.get('/', expenseController.getAllExpenses)
//get user expenses
router.get('/user/:userId', expenseController.getExpenseByUserId)
//get expense byt id
router.get('/:id', expenseController.getExpenseById)
//create expense
router.put('/user/:userId', expenseController.createExpense)
//delete expenses
router.delete('"expenseId', expenseController.deleteExpense)

module.exports = router