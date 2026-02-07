const mongoose = require(mongoose)

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  needs: {
    budgetAmount: { type: Number, default: 0 },
    spentAmount: { type: Number, default: 0 }
  },
  wants: {
    budgetAmount: { type: Number, default: 0 },
    spentAmount: { type: Number, default: 0 }
  },
  savings: {
    budgetAmount: { type: Number, default: 0 },
    spentAmount: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Budjet', budgetSchema )