const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express()

const userRoute = require('./routes/index')

app.use(cors())

app.use('/', userRoute)

exports.api = functions.https.onRequest(app);