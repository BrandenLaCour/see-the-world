require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
//database
require('./db/db')


//middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(session({
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: false
}))

app.use((req, res, next) => {
	if(req.session.loggedIn) {
		res.locals.userId = req.session.userId
		res.locals.username = req.session.username
		res.locals.loggedIn = req.session.loggedIn
		res.locals.message = req.session.message
		res.locals.photoUrl = req.session.photoUrl
		res.locals.firstName = req.session.firstName
	} else {
		res.locals.userId = false
		res.locals.loggedIn = false
		res.locals.username = false
		res.locals.message = ''
	}
	next()
})




const authController = require('./controllers/authController')
app.use('/auth', authController)
const articleController = require('./controllers/articleController')
app.use('/articles', articleController)
const userController = require('./controllers/userController')
app.use('/users', userController)
const commentController = require('./controllers/commentController')
app.use('/comments', commentController)


app.get('/', (req, res) => {
	const message = req.session.message

	req.session.message = ''

	res.render('auth/login.ejs', {
		message: message
	})
})



app.get('*', (req, res) => {
	res.render('404.ejs')	
})







app.listen(PORT, () => {
console.log(`app is listening on port ${PORT}`);

})
