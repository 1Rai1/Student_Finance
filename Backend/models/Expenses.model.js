const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  monthly_budget: {
    type: Number,
    min: 0
  },
  monthly_expenses: {
    type: Number,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  }
});

module.exports = mongoose.model('Expenses', expensesSchema);