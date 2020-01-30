const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const Article = require('../models/article')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const MAP_API_KEY = process.env.MAP_KEY

// GET article index route
router.get('/', async (req, res, next) => {
	try {
		const foundArticles = await Article.find({}).populate('author')

		const message = req.session.message
		req.session.message = ''

		res.render('articles/index.ejs', {
			cloudinary: cloudinary,
			articles: foundArticles,
			message: message
		})
	} catch(err) {
		next(err)
	}

})



// GET filter (show/EDIT) route
//need to dry this up
router.get('/filter', async (req, res, next) => {
	try {
		const message = req.session.message
		req.session.message = ''
		
		//if came from register, show profile photo
		if (req.session.filterState === "register"){
			const foundUser = await User.findById(req.session.newFilterId)
			req.session.filterState = ''
			req.session.newFilterId = ''
			req.session.filterState = 'profile'
			
			//needs to be refactored, but this checks if the user's photo has been filtered or not, then pics the proper photo
			//if pulling from cloudinary, using the original photo.
			if (foundUser.imageUrl){
				const userPhotoUrl = foundUser.imageUrl
				res.render('filter.ejs', {
				message: message,
				objectId: foundUser._id,
				imageUrl: userPhotoUrl,
				imageId: foundUser.imageId,
				cloudUrl: process.env.CLOUD_URL
				})

			}
			else {
				const cloudinaryUrl = cloudinary.url(`${foundUser.imageId}`)
				res.render('filter.ejs', {
				message: message,
				imageUrl: cloudinaryUrl,
				objectId: foundUser._id,
				imageId: foundUser.imageId,
				cloudUrl: process.env.CLOUD_URL
				})
			}
			
			
		}
		else {// show article photo

			const foundArticle = await Article.findById(req.session.newFilterId)
				req.session.filterState = ''
				req.session.newFilterId = ''
				req.session.filterState = 'article'
			//needs to be refactored, but this checks if the user's photo has been filtered or not, then pics the proper photo
			//if pulling from cloudinary, using the original photo.
			if (foundArticle.imageUrl){
				const articlePhotoUrl = foundArticle.imageUrl
				res.render('filter.ejs', {
				message: message,
				imageUrl: articlePhotoUrl,
				objectId: foundArticle._id,
				imageId: foundArticle.imageId,
				cloudUrl: process.env.CLOUD_URL
				})

			}
			else {
				
				const cloudinaryUrl = cloudinary.url(`${foundArticle.imageId}`)
				res.render('filter.ejs', {
				message: message,
				imageUrl: cloudinaryUrl,
				objectId: foundArticle._id,
				imageId: foundArticle.imageId,
				cloudUrl: process.env.CLOUD_URL
				})

			}


			
		}
		
		
	} catch(err) {
		next(err)
	}
})

// filter (UPDATE) route, updates the picture with the filter chosen
router.put('/filter/:id', async (req, res, next) => {

	try {
		
		const filter = req.body.filter
		const id = req.params.id
		
		const cloudUrl = `${process.env.CLOUD_URL}${filter}`
		if (req.session.filterState === 'profile'){
			//if we are adding filter to profile
			const foundUser = await User.findById(id)
			//concat the new filter with the imageid and the url
			const imageUrl =  `${cloudUrl}/${foundUser.imageId}`
			await User.findByIdAndUpdate(id, {imageUrl: imageUrl})
			req.session.photoUrl = imageUrl
			//add cloudinary url to imageUrl of user
			res.redirect('/articles')

		}
		else {
			//if we are adding filter to article photo
			const foundArticle = await Article.findById(id)
			//add cloudinary url to imageUrl of article
			const imageUrl = `${cloudUrl}/${foundArticle.imageId}`
			await Article.findByIdAndUpdate(id, {imageUrl: imageUrl})
			res.redirect('/articles/' + foundArticle._id)

		}
		//redirect to filter show page
		
		
	}
	catch(err){
		next(err)

	}

})

// GET new route
router.get('/new', async (req, res, next) => {
	try {
		const message = req.session.message
		req.session.message = ''

		res.render('articles/new.ejs', {
			message: message
		})
	} catch(err) {
		next(err)
	}
})

//Edit route for Articles
router.get('/:id/edit', async (req, res, next) => {

	try {
		const foundArticle = await Article.findById(req.params.id)
		res.render('articles/edit.ejs', {article: foundArticle})
	}
	catch(err){
		next(err)

	}
	
})



//Update route for Articles
router.put('/:id', upload.single('image'), async (req, res, next) => {

	try {
		const articleEdited = req.body

		//if they don't upload a picture, we will query the database and get the old picture
		if(!req.file) {
			const foundArticle = await Article.findById(req.params.id)
			articleEdited.imageId = foundArticle.imageId

		} else {
			// if upload new picture, get that picture add it to db, and cloudinary
			const uploadResult = await cloudinary.uploader.upload(req.file.path, function(error, result) {
				if(error) next(error)
			});
			articleEdited.imageId = uploadResult.public_id

		}

		await Article.findByIdAndUpdate(req.params.id, articleEdited)
		req.session.newFilterId = req.params.id
        req.session.filterState = 'article'
		setTimeout(()=>{
			res.redirect(`/articles/filter`)

		}, 100)

		
	}
	catch(err){
		next(err)

	}
	
})






// GET article show page
router.get('/:id', async (req, res, next) => {
	try {
		const foundArticle = await Article.findById(req.params.id).populate('author').populate('comments.user')
		const userId = req.session.userId
		const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${MAP_API_KEY}&q=${foundArticle.location}`

		let foundAuthor = false
		// is if this is the owner of the article
		if(foundArticle.author && userId == foundArticle.author._id){
			// if so, foundAuthor is true
			foundAuthor = true
		}
		
		const imageUrl = await cloudinary.url(`${foundArticle.imageId}.jpg`)
		res.render('articles/show.ejs', {
			imageUrl: imageUrl,
			article: foundArticle,
			foundAuthor: foundAuthor,
			mapUrl: mapUrl
		})
	} catch(err) {
		next(err)
	}
})

// PUT likes route (update likes): articles/likes
router.put('/likes/:id', async (req, res, next) => {
	try {
		const userId = req.session.userId
		const articleId = req.params.id
		const foundArticle = await Article.findById(articleId)
		if(foundArticle.likes.includes(userId)) {
			// maybe remove the user


			res.redirect('/articles/'+articleId)
			// else add the user 
		} else {
			foundArticle.likes.push(userId) 
			const updatedArticle = await Article.findByIdAndUpdate(articleId, foundArticle)

			res.redirect('/articles/'+articleId)
		}


		console.log(req.params.id);


	} catch(err) {
		next(err)
	}
})


//POST create route:
router.post('/', upload.single('image'), async (req, res, next) => {
	try {
		const filePath = req.file.path
		const uploadResult = await cloudinary.uploader.upload(filePath, function(error, result) { if (error) next(error) });
		const newArticle = {
			title: req.body.title,
			imageId: uploadResult.public_id,
			description: req.body.description,
			tips: req.body.tips,
			location: req.body. location,
			author: req.session.userId
			//author: 'req.session.userId' this is so we can not have to log in during development
		}
		const createdArticle = await Article.create(newArticle)

		//delete upload local
		fs.access(filePath, error => {

			if (!error){
				
				fs.unlink(filePath, (err) => {
					if (err) next(err);
				})
			}else {

				next(error)
			}

		})



		req.session.newFilterId = createdArticle._id
		req.session.filterState = 'article'
		res.redirect('/articles/filter')
	} catch(err) {
		next(err)
	}
})

//delete route

router.delete('/:id', async (req, res, next) => {
	try {
		const foundArticle = await Article.findById(req.params.id)
		const deletedArticle = await Article.findByIdAndRemove(req.params.id)
		await cloudinary.uploader.destroy(foundArticle.imageId, (result) => { console.log(result)})
		res.redirect('/articles')
	}
	catch(err){
		next(err)

	}

	})






module.exports = router