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
			res.redirect('/login')
		}

	} catch(err) {
		next(err)
	}
})











module.exports = router