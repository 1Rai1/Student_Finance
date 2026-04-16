const express = require('express');
const router = express.Router();
const expenseController = require('./expense-Controller'); 
const { verifyToken, verifyAdmin, verifyOwnership, verifyExpenseOwnership } = require('../Middleware/auth');
const { strictLimiter, readLimiter } = require('../Middleware/rateLimiter');

//get all expenses (admin only)
router.get('/', verifyToken, verifyAdmin, readLimiter, expenseController.getAllExpenses);
//get by user id (requires token and ownership)
router.get('/user/:userId', verifyToken, verifyOwnership, readLimiter, expenseController.getExpenseByUserId);
//get expense by id (admin only)
router.get('/:id', verifyToken, verifyAdmin, readLimiter, expenseController.getExpenseById);
//create expense (requires token)
router.post('/user/:userId', verifyToken, strictLimiter, expenseController.createExpense);
//update expense (requires token and expense ownership)
router.put('/:expenseId', verifyToken, verifyExpenseOwnership, strictLimiter, expenseController.updateExpense);
//delete expense (requires token and expense ownership)
router.delete('/:expenseId', verifyToken, verifyExpenseOwnership, strictLimiter, expenseController.deleteExpense);

module.exports = router;