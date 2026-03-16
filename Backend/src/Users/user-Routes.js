const express = require('express')
const router = express.Router()
const userController = require('./user-Controller')

//get All Users
router.get('/', userController.getAllUser)
//serach user
router.get('/query', userController.getUsersByQuery)
//get Specific user
router.get('/:id', userController.getUserById)
//create user
router.post('/create', userController.createUser)
//update user
router.put('/:id', userController.updateUser)
//delete user
router.delete('/:id', userController.deleteUser)

module.exports = router