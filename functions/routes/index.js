const express = require('express');

const router = express.Router();
const authGuard = require('../util/authGuard');

const {
    login, signUp, image, getAll,
} = require('../controllers/user/index');

// user Routes
router.post('/signup', signUp);
router.post('/login', login);
router.post('/user/image', authGuard, image);
router.get('/users', getAll);

module.exports = router;
