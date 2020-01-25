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
		console.log('this is req.file');
		console.log(req.file);
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
		console.log('this is the newUser: ');
		console.log(newUser);
		// check if the username already exist
		const foundUser = await User.find({username: newUser.username})
		// if does redirect to register
		// inform the user
		if(foundUser.length > 0) {
			req.session.message = "Username already exists"

			res.redirect('/auth/register')
		} else {
			req.session.message = "Registration succesful " + newUser.firstName

			await User.create(newUser)
			req.session.userId = newUser._id
			req.session.username = newUser.username

			res.redirect('/auth/filter')
		}

	} catch(err) {
		next(err)
	}
})











module.exports = router