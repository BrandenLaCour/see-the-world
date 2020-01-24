require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT


require('./db/db')



app.get('/', (req, res) => {
	res.send('Hello World')
})



app.listen(PORT, () => {
console.log(`app is listening on port ${PORT}`);

})