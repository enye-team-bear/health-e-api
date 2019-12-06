const express = require('express');

const router = express.Router();
const authGuard = require('../util/authGuard');

const {
    login, signUp, image, getAll,
} = require('../controllers/user/index');

const {
    newTopic, getTopics,
} = require('../controllers/post/index');

// user Routes
router.post('/signup', signUp);
router.post('/login', login);
router.put('/user/image', authGuard, image);
router.get('/users', getAll);
router.post('/new_topic', newTopic);
router.get('/get_topics', getTopics);

module.exports = router;
