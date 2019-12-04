const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const functions = require('firebase-functions');

dotenv.config();

const app = express();

const userRoute = require('./routes/index');

app.use(cors());

app.use('/', userRoute);

exports.api = functions.https.onRequest(app);
