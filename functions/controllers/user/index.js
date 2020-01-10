const { db } = require('../../util/admin');
const { signupUser } = require('./signUp');
const { loginUser } = require('./login');
const { imageUpload } = require('./imageUpload');
const { getAllUser } = require('./getUsers');
const { getAUser } = require('./getAUser');
const { userUpdate } = require('./userUpdate');
const { getAuthUserCredentials } = require('./getAuthUserCredentials');
const { coverPhotoUpload } = require('./coverPhoto');

const login = (req, res) => loginUser(req, res, db);
const signUp = (req, res) => signupUser(req, res, db);
const image = (req, res) => imageUpload(req, res, db);
const getAll = (req, res) => getAllUser(req, res, db);
const getUserById = (req, res) => getAUser(req, res, db);
const AuthUserCredentials = (req, res) => getAuthUserCredentials(req, res, db);
const updateUser = (req, res) => userUpdate(req, res, db);
const coverPhoto = (req, res) => coverPhotoUpload(req, res, db);

module.exports = {
    AuthUserCredentials,
    coverPhoto,
    getAll,
    getUserById,
    image,
    login,
    signUp,
    updateUser,
};
