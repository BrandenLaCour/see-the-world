const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage})




// route for login page
router.get('/login', (req, res) => {
	const message = req.session.message

	req.session.message = ''

	res.render('auth/login.ejs', {
		message: message
	})	
})

// POST
router.post('/login', async (req, res, next) => {
	try {
		const foundUser = await User.findOne({username: req.body.username})
		


		// if the user is found check the password
		// if is not found redirect to login
		if(foundUser) {
			
			if(foundUser.password === req.body.password) {
				req.session.username = foundUser.username
				req.session.userId = foundUser._id
				req.session.message = `Welcome back ${req.session.username}`
				res.redirect('/')
			} else {
				req.session.message = "Username or password is incorrect"

				res.redirect('/auth/login')
			}

		} else {
			req.session.message = "Username or password is incorrect"

			res.redirect('/auth/login')
		}

		//if found check password
		// if pw is correct add username to req.session.username
		// redirect to home page redirect('/')



	} catch(err) {
		next(err)
	}
})


// GET register route
router.get('/register', (req, res) => {
	const message = req.session.message

	req.session.message = ''
	res.render('auth/register.ejs', {
		message: message
	})	
})

// POST route
router.post('/register', upload.single('image'), async (req, res, next) => {
	try {
		// new user proposal
		const newUser = {
			username: req.body.username,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			city: req.body.city,
			about: req.body.about,
			favoritePlace: req.body.favoritePlace,
			image: {
				data: req.file.buffer,
				contentType: req.file.mimeType
			}
		}
		
		// check if the username already exist
		const foundUser = await User.find({username: newUser.username})
		// if does redirect to register
		// inform the usergit pum
		if(foundUser.length > 0) {
			req.session.message = "Username already exists"

			res.redirect('/auth/register')
		} else {
			//create user
			req.session.message = "Registration succesful " + newUser.firstName
			const createdUser = await User.create(newUser)

			//put user into session so that we can put a filter onto it and track the user
			req.session.userId = createdUser._id
			req.session.username = newUser.username
			req.session.loggedIn = true
			req.session.newFilterId = createdUser._id
			req.session.filterState = 'register'
			res.redirect('/articles/filter')

			
		}

	} catch(err) {
		next(err)
	}
})











module.exports = router