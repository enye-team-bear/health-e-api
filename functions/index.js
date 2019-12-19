const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const functions = require('firebase-functions');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');

dotenv.config();

const app = express();

const userRoute = require('./routes/index');

app.use(cors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/', userRoute);

exports.api = functions.https.onRequest(app);
