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
    favoritePlace: {
        type: String,
        required: true
    },
    about: String,
    imageId: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    }
})


const User = mongoose.model('User', userSchema)

module.exports = User