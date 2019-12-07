const { db } = require('../../util/admin');
const { signupUser } = require('./signUp');
const { loginUser } = require('./login');
const { imageUpload } = require('./imageUpload');
const { getAllUser } = require('./getUsers');
const { getAUser } = require('./getAUser');

const login = (req, res) => loginUser(req, res, db);
const signUp = (req, res) => signupUser(req, res, db);
const image = (req, res) => imageUpload(req, res, db);
const getAll = (req, res) => getAllUser(req, res, db);
const getUserById = (req, res) => getAUser(req, res, db);

module.exports = {
    getAll,
    getUserById,
    image,
    login,
    signUp,
};
