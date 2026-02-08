const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
    description: {
      type: String,
      reqired: true  
    },
    isDiscount: {
        type: Boolean,
        default: false
    },
})

module.export = mongoose.model('Links', linkSchema)