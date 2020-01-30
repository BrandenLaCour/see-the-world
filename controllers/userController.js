const express = require('express')
const router = express.Router()
const User = require('../models/user')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const upload = multer({ dest: "uploads/"})
const bcrypt = require('bcrypt')
const Article = require('../models/article')




// GET of profile of current user
router.get('/profile/', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.session.userId)
		const userPhotoUrl = !foundUser.imageUrl ? `${process.env.CLOUD_URL}/${foundUser.imageId}` : foundUser.imageUrl

		res.render('users/showProfile.ejs', {
			user: foundUser,
			imageUrl: userPhotoUrl
		})
	} catch(err) {
		next(err)
	}
})

//Get show page of user clicked
router.get('/:id', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.params.id)
		const userPhotoUrl = cloudinary.url(`${foundUser.imageId}.jpg`)

		res.render('users/show.ejs', {
			user: foundUser,
			imageUrl: userPhotoUrl
		})
		
	}
	catch(err){
		next(err)
	}
	})

// GET user's articles route
router.get('/:id/articles', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.params.id)
		const foundArticles = await Article.find({author: req.params.id})
		
		res.render('users/userArticles.ejs', {
			user: foundUser,
			articles: foundArticles,
			cloudinary: cloudinary
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

//Get all users (index)
router.get('/', async (req, res, next) => {
	try {
		const foundUsers = await User.find({})
		res.render('users/index.ejs', {users: foundUsers})
	}
	catch(err){
		next(err)
	}
	})



// GET edit route
router.get('/profile/:id/edit', async (req, res, next) => {
	try {
		const message = req.session.message
		req.session.message = ''
		// check if the user is logged in
		// if so, send them to the edit page
		const isLoggedIn = req.session.loggedIn

		const profileToEdit = await User.findById(req.session.userId)

		res.render('users/edit.ejs', {
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
		req.session.newFilterId = req.session.userId
        req.session.filterState = 'register'
		setTimeout(()=>{
			res.redirect('/articles/filter')



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
		await cloudinary.uploader.destroy(foundUser.imageId, (result) => { if (error) next(error)})
		await req.session.destroy()

		res.redirect('/auth/login')
	} catch(err) {
		next(err)
	}
})




		



module.exports = router