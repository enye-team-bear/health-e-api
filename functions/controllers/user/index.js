const { db } = require('../../util/admin');
const { signupUser } = require('./signUp');
const { loginUser } = require('./login');
const { imageUpload } = require('./imageUpload');
const { getAllUser } = require('./getUsers');
const { getAUser } = require('./getAUser');
const { getAuthUserCredentials } = require('./getAuthUserCredentials');

const login = (req, res) => loginUser(req, res, db);
const signUp = (req, res) => signupUser(req, res, db);
const image = (req, res) => imageUpload(req, res, db);
const getAll = (req, res) => getAllUser(req, res, db);
const getUserById = (req, res) => getAUser(req, res, db);
const AuthUserCredentials = (req, res) => getAuthUserCredentials(req, res, db);

module.exports = {
    AuthUserCredentials,
    getAll,
    getUserById,
    image,
    login,
    signUp,
};
