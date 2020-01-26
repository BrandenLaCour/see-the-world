const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const Article = require('../models/article')
const cloudinary = require('cloudinary').v2

// GET article index route
router.get('/', async (req, res, next) => {
	try {
		const foundArticles = await Article.find({})
		console.log(foundArticles);


		res.render('articles/index.ejs', {
			articles: foundArticles
		})
	} catch(err) {
		next(err)
	}

})


// article index GET route
router.get('/image/:id', async (req, res, next) => {
	try {
		const article = await Article.findById(req.params.id)
		res.set('Content-Type', article.image.contentType)
		res.send(article.image.data)
	} catch(err) {
		next(err)
	}
})



// GET filter route
router.get('/filter', async (req, res, next) => {
	try {
		const message = req.session.message
		req.session.message = ''
		

		if (req.session.filterState === "register"){
			const foundUser = await User.findById(req.session.newFilterId)
			req.session.filterState = ''
			req.session.newFilterId = ''
			
			const userPhotoUrl = cloudinary.url(`${foundUser.imageId}.jpg`)
			res.render('filter.ejs', {
			message: message,
			imageUrl: userPhotoUrl
		})
		}
		else {
			const foundArticle = await Article.findById(req.session.newFilterId)
			req.session.filterState = ''
			req.session.newFilterId = ''
			
			const articlePhotoUrl = cloudinary.url(`${foundArticle.imageId}.jpg`)
			res.render('filter.ejs', {
			message: message,
			imageUrl: articlePhotoUrl
		})

		}
		
		
	} catch(err) {
		next(err)
	}
})


// GET image for filter
router.get('/filter/image', async (req, res, next) => {
	try {
		if (req.session.filterState === "register"){
			const foundUser = await User.findById(req.session.newFilterId)
			req.session.filterState = ''
			req.session.newFilterId = ''
			
			res.send(cloudinary.url(foundUser.imageId))
		}
		else {
			const foundArticle = await Article.findById(req.session.newFilterId)
			req.session.filterState = ''
			req.session.newFilterId = ''
			
			res.send(cloudinary.url(foundArticle.imageId))

		}
		
	} catch(err) {
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


//POST create route:
router.post('/', upload.single('image'), async (req, res, next) => {
	try {
		
		const uploadResult = await cloudinary.uploader.upload(req.file.path, function(error, result) { if (error) next(error) });
		const newArticle = {
			title: req.body.title,
			imageId: uploadResult.public_id,
			description: req.body.description,
			tips: req.body.tips,
			location: req.body. location,
			author: req.session.userId
		}
		const createdArticle = await Article.create(newArticle)
		req.session.newFilterId = createdArticle._id
		req.session.filterState = 'article'
		res.redirect('/articles/filter')
	} catch(err) {
		next(err)
	}
})









module.exports = router