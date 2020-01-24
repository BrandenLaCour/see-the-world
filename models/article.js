const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	image: {
		data: Buffer,
		required: true
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
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	comments: [Comment.schema],
	likes: Number
})