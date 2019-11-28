const config = require("../../util/config");
const firebase = require("firebase");
require("firebase/firestore");
firebase.initializeApp(config);
const signUp = require('./signUp');
const login = require('./login')

const db = firebase.firestore();

const loginUser = (req, res) => login.loginUser(req, res, db );
const signUpUser = (req, res) => signUp.signupUser(req, res, db);

module.exports = {
    loginUser,
    signUpUser
}





