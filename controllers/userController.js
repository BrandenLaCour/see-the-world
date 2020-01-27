const express = require('express')
const router = express.Router()
const User = require('../models/user')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const upload = multer({ dest: "uploads/"})
const bcrypt = require('bcrypt')




// GET profile route
router.get('/profile', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.session.userId)

		const userPhotoUrl = cloudinary.url(`${foundUser.imageId}.jpg`)

		res.render('user/show.ejs', {
			user: foundUser,
			imageUrl: userPhotoUrl
		})
	} catch(err) {
		next(err)
	}
})
 
// GET profile image route
// router.get('/profile/image', async (req, res, next) => {
// 	try {
// 		const foundUser = await User.findById(req.session.userId)

// 		res.send(cloudinary.url(foundUser.imageId))
// 	} catch(err) {
// 		next(err)
// 	}
// })



// GET edit route
router.get('/profile/:id/edit', async (req, res, next) => {
	try {
		const message = req.session.message
		req.session.message = ''
		// check if the user is logged in
		// if so, send them to the edit page
		const isLoggedIn = req.session.loggedIn

		const profileToEdit = await User.findById(req.session.userId)

		res.render('user/edit.ejs', {
			isLoggedIn: isLoggedIn,
			user: profileToEdit,
			message: message
		})

	} catch(err) {
		next(err)
	}
})


// Update route
router.put('/profile/:id', upload.single('image'), async (req, res, next) => {
	try {
		// encrypt new pass
		const salt = bcrypt.genSaltSync(10)
		const hashedPassword = bcrypt.hashSync(req.body.password, salt)

		// new user proposal
		const newUser = {
			username: req.session.username,
			password: hashedPassword,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			city: req.body.city,
			about: req.body.about,
			favoritePlace: req.body.favoritePlace,
			imageId: req.body.image
		}
		// if doesnt upload a new picture
		if(!req.file) {
			// keep the old picture on the profile
			const user = await User.findById(req.session.userId)
			newUser.imageId = user.imageId

		} else {
			// if upload new picture
			// update the picture on the profile
			const uploadResult = await cloudinary.uploader.upload(req.file.path, function(error, result) {
				if(error) next(error)
			});
			newUser.imageId = uploadResult.public_id

		}
		await User.findByIdAndUpdate(req.session.userId, newUser)
		setTimeout(()=>{
			res.redirect('/users/profile')

		}, 100)
	} catch(err) {
		next(err)
	}
})


// Destroy profile route
router.delete('/profile/:id', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.params.id)
		const user = await User.findByIdAndRemove(req.session.userId)
		await cloudinary.uploader.destroy(foundUser.imageId, (result) => { console.log(result)})
		await req.session.destroy()

		res.redirect('/auth/login')
	} catch(err) {
		next(err)
	}
})


		



module.exports = router