const admin = require('firebase-admin');
const firebase = require('firebase');
// const serviceAccount = require('../serviceAccount.json');
require('firebase/firestore');

firebase.initializeApp({
    apiKey: 'AIzaSyBkmmr4aw78eOx7c57KHSMF43Z0RmImYck',
    appId: '1:386461795826:web:11748057ba53fb43c5d76b',
    authDomain: 'health-e-1015d.firebaseapp.com',
    databaseURL: 'https://health-e-1015d.firebaseio.com',
    measurementId: 'G-CC55C7P30L',
    messagingSenderId: '386461795826',
    projectId: 'health-e-1015d',
    storageBucket: 'health-e-1015d.appspot.com',
});

admin.initializeApp();

const db = firebase.firestore();

module.exports = { admin, db };
