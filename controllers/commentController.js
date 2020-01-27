const express = require('express')
const router = express.Router()
const Article = require('../models/article.js')
const Comment = require('../models/comment.js')


// comment create route
router.post('/:articleId', async (req, res, next) => {
	try {
		const foundArticle = await Article.findById(req.params.articleId)
		const createdComment = await Comment.create({
			text: req.body.commentText,
			user: req.session.userId
		})
		// push comment into the article comment
		foundArticle.comments.push(createdComment)
		await foundArticle.save()

		res.redirect('/articles/'+foundArticle._id)
	} catch(err) {
		next(err)
	}
})




module.exports = router