const admin = require('firebase-admin');
const firebase = require('firebase');
const dotenv = require('dotenv');
// const serviceAccount = require('../serviceAccount.json');
require('firebase/firestore');

dotenv.config();

firebase.initializeApp({
    apiKey: process.env.API_KEY,
    appId: process.env.APP_ID,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
});

admin.initializeApp();

const db = firebase.firestore();

module.exports = { admin, db };
