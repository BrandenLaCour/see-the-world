const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const Article = require('../models/article')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

// GET article index route
router.get('/', async (req, res, next) => {
	try {
		const foundArticles = await Article.find({})
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


// article index GET route
router.get('/image/:id', async (req, res, next) => {
	try {
		const article = await Article.findById(req.params.id)

		res.send(cloudinary.url(article.imageId))		
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
		setTimeout(()=>{
			res.redirect(`/articles/${req.params.id}`)

		}, 100)

		
	}
	catch(err){
		next(err)

	}
	
})


// GET article show page
router.get('/:id', async (req, res, next) => {
	try {
		const foundArticle = await Article.findById(req.params.id)

		const userId = req.session.userId
		console.log(foundArticle.author);
		console.log(userId);

		let foundAuthor = false
		// is if this is the owner of the article
		if(userId == foundArticle.author){
			// if so, foundAuthor is true
			foundAuthor = true
		}

		const imageUrl = await cloudinary.url(`${foundArticle.imageId}.jpg`)
		res.render('articles/show.ejs', {
			imageUrl: imageUrl,
			article: foundArticle,
			foundAuthor: foundAuthor
		})
	} catch(err) {
		next(err)
	}
})


// GET article show page
// router.get('/:id/image', async (req, res, next) => {
// 	try {
// 		const foundArticle = await Article.findById(req.params.id)

// 		res.send(cloudinary.url(foundArticle.imageId))
// 	} catch(err) {
// 		next(err)
// 	}
// })






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









module.exports = router