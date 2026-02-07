const express = require('express')
const router = express.Router()
const UserController = require('./userController')

router.post('/', UserController.registerUser)//create user
router.get('/', UserController.getUsers)//get all user
router.get('/:id', UserController.getUserProfile)//get specific user
router.put('/:id', UserController.updateUserProfile)//update user
router.delete('/:id', UserController.deleteUserProfile)//delete user

module.exports = router