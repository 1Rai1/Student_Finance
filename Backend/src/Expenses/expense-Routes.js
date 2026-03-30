const express = require('express');
const router = express.Router();
const expenseController = require('./expense-Controller'); 
const {verifyAdmin, verifyOwnership } = require('../Middleware/auth');
const { strictLimiter, readLimiter } = require('../Middleware/rateLimiter');

//get all expenses
router.get('/',verifyAdmin,readLimiter,expenseController.getAllExpenses);
//get by user id
router.get('/user/:userId',verifyOwnership,readLimiter, expenseController.getExpenseByUserId);
//get expense by id
router.get('/:id',verifyAdmin,readLimiter, expenseController.getExpenseById);
//create expense
router.post('/user/:userId',strictLimiter, expenseController.createExpense);
//update expense
router.put('/:expenseId',verifyOwnership,strictLimiter, expenseController.updateExpense);
//delete expenese
router.delete('/:expenseId',verifyOwnership,strictLimiter, expenseController.deleteExpense);

module.exports = router;
