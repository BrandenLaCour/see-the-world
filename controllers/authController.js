const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt') // encrypt password
const User = require('../models/user')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const cloudinary = require('cloudinary').v2



// route for login page
router.get('/login', (req, res) => {
    const message = req.session.message

    req.session.message = ''

    res.render('auth/login.ejs', {
        message: message
    })
})

// POST
router.post('/login', async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username })



        // if the user is found check the password
        // if is not found redirect to login
        if (foundUser) {
            // check that the password is correct
            const loginInfoIsValid = bcrypt.compareSync(req.body.password, foundUser.password)


            if (loginInfoIsValid) {
                req.session.username = foundUser.username
                req.session.userId = foundUser._id
                req.session.loggedIn = true
                req.session.message = `Welcome back ${req.session.username}`



                res.redirect('/articles')
            } else {
                req.session.message = "Username or password is incorrect"

                res.redirect('/auth/login')
            }

        } else {
            req.session.message = "Username or password is incorrect"

            res.redirect('/auth/login')
        }

        //if found check password
        // if pw is correct add username to req.session.username
        // redirect to home page redirect('/')



    } catch (err) {
        next(err)
    }
})

// GET logout route
router.get('/logout', async (req, res, next) => {
    try {
        await req.session.destroy()

        res.redirect('/auth/login')
    } catch (err) {
        next(err)
    }
})





// GET register route
router.get('/register', (req, res) => {
    const message = req.session.message

    req.session.message = ''
    res.render('auth/register.ejs', {
        message: message
    })
})

// POST route
router.post('/register', upload.single('image'), async (req, res, next) => {
    try {
        // encrypt password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        // new user proposal
        const newUser = {
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            about: req.body.about,
            favoritePlace: req.body.favoritePlace,
            imageId: ''
        }

        // check if the username already exist
        const foundUser = await User.find({ username: newUser.username })
        // if does redirect to register
        // inform the usergit pum
        if (foundUser.length > 0) {
            req.session.message = "Username already exists"

            res.redirect('/auth/register')
        } else {

            //create user
            const uploadResult = await cloudinary.uploader.upload(req.file.path, function(error, result) { if (error) next(error) });
            newUser.imageId = uploadResult.public_id
            req.session.message = "Registration succesful " + newUser.firstName
            const createdUser = await User.create(newUser)
            const filePath = req.file.path

            //delete user file locally
            fs.access(filePath, error => {

                if (!error) {

                    fs.unlink(filePath, (err) => {
                        if (err) next(err);
                    })
                } else {

                    next(error)
                }

            })

            //put user into session so that we can put a filter onto it and track the user
            req.session.userId = createdUser._id
            req.session.username = newUser.username
            req.session.loggedIn = true
            req.session.newFilterId = createdUser._id
            req.session.filterState = 'register'
            res.redirect('/articles/filter')


        }

    } catch (err) {
        next(err)
    }
})











module.exports = router