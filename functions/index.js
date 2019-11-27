const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express()

app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome to Health-e !!!')
})

const { 
    signupUser, 
    loginUser 
} = require('./controllers/user')

//user Routes
app.post('/signup', signupUser);
app.post('/login', loginUser)

exports.api = functions.https.onRequest(app);

