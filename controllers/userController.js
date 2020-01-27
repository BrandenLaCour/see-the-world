const express = require('express')
const router = express.Router()
const User = require('../models/user')



// GET profile route
router.get('/', async (req, res, next) => {
	try {
		

		res.render('user/profile.ejs')
	} catch(err) {
		next(err)
	}
})











module.exports = router