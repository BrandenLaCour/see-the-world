const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const Article = require('../models/article')


// GET article index route
router.get('/', async (req, res, next) => {
	try {
		const foundArticles = await Article.find({})
		console.log(foundArticles);


		res.render('article/index.ejs', {
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

		res.render('filter.ejs', {
			message: message
		})
	} catch(err) {
		next(err)
	}
})


// GET filter route
router.get('/filter/image', async (req, res, next) => {
	try {
		const foundUser = await User.findById(req.session.userId)
		console.log(`the found user is ${foundUser}`);
		res.set('Content-Type', foundUser.image.contentType)
		res.send(foundUser.image.data)
	} catch(err) {
		next(err)
	}
})


// GET new route
router.get('/new', async (req, res, next) => {
	try {
		const message = req.session.message
		req.session.message = ''

		res.render('article/new.ejs', {
			message: message
		})
	} catch(err) {
		next(err)
	}
})


//POST create route:
router.post('/', upload.single('image'), async (req, res, next) => {
	try {
		const newArticle = {
			title: req.body.title,
			image: {
				data: req.file.buffer,
				contentType: req.file.mimeType
			},
			description: req.body.description,
			tips: req.body.tips,
			location: req.body. location,
			author: req.session.userId
		}
		const createdArticle = await Article.create(newArticle)

		console.log(newArticle);
		res.redirect('/articles/filter')
	} catch(err) {
		next(err)
	}
})









module.exports = router