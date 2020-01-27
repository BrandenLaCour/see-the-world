const express = require('express')
const router = express.Router()
const User = require('../models/user')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const upload = multer({ dest: "uploads/"})




// GET profile route
router.get('/', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.session.userId)
		console.log(foundUser);

		const userPhotoUrl = cloudinary.url(`${foundUser.imageId}.jpg`)

		res.render('user/show.ejs', {
			user: foundUser,
			imageUrl: userPhotoUrl
		})
	} catch(err) {
		next(err)
	}
})


// GET profile route
router.get('/image', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.session.userId)

		res.send(cloudinary.url(foundUser.imageId))
	} catch(err) {
		next(err)
	}
})



// GET edit route
router.get('/:id/edit', async (req, res, next) => {
	try {
		// check if the user is logged in
		// if so, send them to the edit page
		const isLoggedIn = req.session.loggedIn

		const profileToEdit = await User.findById(req.session.userId)
		console.log('profileToEdit');
		console.log(profileToEdit);

		res.render('user/edit.ejs', {
			isLoggedIn: isLoggedIn,
			profileToEdit: profileToEdit
		})

	} catch(err) {
		next(err)
	}
})










module.exports = router