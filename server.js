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

const authController = require('./controllers/authController')
app.use('/auth', authController)


app.get('/', (req, res) => {
	const message = req.session.message

	req.session.message = ''

	res.render('home.ejs', {
		message: message
	})
})



app.listen(PORT, () => {
console.log(`app is listening on port ${PORT}`);

})
