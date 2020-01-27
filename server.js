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
	} else {
		res.locals.userId = false
		res.locals.loggedIn = false
		res.locals.username = false
	}
	next()
})




const authController = require('./controllers/authController')
app.use('/auth', authController)
const articleController = require('./controllers/articleController')
app.use('/articles', articleController)
const userController = require('./controllers/userController')
app.use('/users', userController)


app.get('/', (req, res) => {
	const message = req.session.message

	req.session.message = ''

	res.render('auth/login.ejs', {
		message: message
	})
})



app.listen(PORT, () => {
console.log(`app is listening on port ${PORT}`);

})
