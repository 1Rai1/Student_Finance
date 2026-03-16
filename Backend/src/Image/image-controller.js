const {db,bucket} = require('./../../firebase/firebase-admin')

const discountCollection = db.collection('discounts')
const userCollection = db.collection('users')