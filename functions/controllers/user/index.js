const config = require("../../util/config");
const firebase = require("firebase");
require("firebase/firestore");
firebase.initializeApp(config);
const { signupUser }= require('./signUp');
const { loginUser } = require('./login')
const { imageUpload } = require('./imageUpload')
const db = firebase.firestore();

const loginUser = (req, res) => loginUser(req, res, db );
const signUpUser = (req, res) => signupUser(req, res, db);
const imageUpload = (req, res) => imageUpload(req, res, db);

module.exports = {
    loginUser,
    signUpUser,
    imageUpload
}





