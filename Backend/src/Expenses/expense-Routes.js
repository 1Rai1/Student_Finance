const express = require('express');
const router = express.Router();
const expenseController = require('./expense-Controller'); 

//get all expenses
router.get('/', expenseController.getAllExpenses);
//get by user id
router.get('/user/:userId', expenseController.getExpenseByUserId);
//get expense by id
router.get('/:id', expenseController.getExpenseById);
//create expense
router.post('/user/:userId', expenseController.createExpense);
//delete expenese
router.delete('/:expenseId', expenseController.deleteExpense);

module.exports = router;
