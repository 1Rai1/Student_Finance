const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id:{

  },
  user_name: {
    type: String,
    required: true,
    trim: true
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  user_password: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Users', userSchema);