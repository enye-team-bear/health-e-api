const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express()

app.use(cors())

const { signupUser } = require('./controllers/user')

//user Routes
app.post('/signup', signupUser);

exports.api = functions.https.onRequest(app);

