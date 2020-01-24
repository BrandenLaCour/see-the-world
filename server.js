require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const bodyParser = require('body-parser')
//database
require('./db/db')


//middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))



app.get('/', (req, res) => {
	res.render('home.ejs')
})



app.listen(PORT, () => {
console.log(`app is listening on port ${PORT}`);

})
