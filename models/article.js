const mongoose = require('mongoose')
const Comment = require('./comment')


const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	imageId: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String,
		default: ''
	},
	description: String,
	tips: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	location: {
		type: String,
		required: true
	},
	comments: [Comment.schema],
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}] // Article.find().where( user $in likes ) if we want to search all the users likes
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article
