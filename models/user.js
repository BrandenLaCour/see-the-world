const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: String,
	city: {
		type: String,
		required: true
	},
	articles: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article',
		required: true
	},
	favoritePlace: {
		type: String,
		required: true
	},
	about: String,
	image: {
		data: Buffer,
		contentType: String
	}
})


const User = mongoose.model('User', userSchema)

module.exports = User