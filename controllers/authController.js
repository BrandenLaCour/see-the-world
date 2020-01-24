const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')


// route for login page
router.get('/login', (req, res) => {
	res.render('auth/login')	
})