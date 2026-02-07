const mongoose = require('mongoose')

const linkSchema = new moogoose.Schema({
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