const express = require('express')
const route = express.Router()

const userAuthController = require('../controller/User.controller')
route.post('/register',userAuthController.registerUser)
route.post('/login',userAuthController.loginUser)
route.get('/dashboard',userAuthController.dashboard)

module.exports = route
