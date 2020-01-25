const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')


// GET article route
router.get('/', (req, res, next) => {
	res.render('article/index.ejs')
})














module.exports = router