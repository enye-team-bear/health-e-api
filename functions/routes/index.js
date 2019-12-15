const express = require('express');

const router = express.Router();
const authGuard = require('../util/authGuard');

const {
    login,
    signUp,
    image,
    getAll,
    getUserById,
    AuthUserCredentials,
} = require('../controllers/user/index');

// user Routes
router.post('/signup', signUp);
router.post('/login', login);
router.put('/user/image', authGuard, image);
router.get('/users', getAll);
router.get('/user', authGuard, AuthUserCredentials);
router.get('/user/:userName', getUserById);

module.exports = router;
