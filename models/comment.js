const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
		},
	date: {
		type: Date,
		default: Date.now
	}
})


const Comment = mongoose.model("Comment", commentSchema)


module.exports = Comment