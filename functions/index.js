const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express()

app.use(cors())

const { loginUser, signUpUser } = require('./controllers/user/index')

//user Routes
app.post('/signup', signUpUser);
app.post('/login', loginUser);

exports.api = functions.https.onRequest(app);

