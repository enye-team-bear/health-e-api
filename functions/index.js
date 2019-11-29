const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express()
const authGuard = require('./util/authGuard')

app.use(cors())

const { login, signUp, image, getAll } = require('./controllers/user/index')

//user Routes
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', authGuard, image);
app.get('/users', getAll)

exports.api = functions.https.onRequest(app);