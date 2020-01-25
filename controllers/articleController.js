const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')


// GET article route
router.get('/', (req, res, next) => {
	res.render('article/index.ejs')
})

// GET filter route
router.get('/filter', async (req, res, next) => {
	try {
		const message = req.session.message


		res.render('filter.ejs', {
			message: message
		})
	} catch(err) {
		next(err)
	}
})












module.exports = router