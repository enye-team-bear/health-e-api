/* eslint-disable indent */
/* eslint-disable no-tabs */
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

const { newTopic, getTopics } = require('../controllers/topic/index');

const {
	newPost,
	getPosts,
	comment,
	like,
} = require('../controllers/post/index');

const {
    newComment, getComments,
} = require('../controllers/comment/index');

// user Routes
router.post('/signup', signUp);
router.post('/login', login);
router.put('/user/image', authGuard, image);
router.get('/users', getAll);
router.get('/user', authGuard, AuthUserCredentials);
router.get('/user/:userName', getUserById);
router.post('/new_topic', authGuard, newTopic);
router.get('/get_topics', getTopics);
router.post('/post/:postId/comment', authGuard, comment);
router.get('/post/:postId/like', authGuard, like);
router.post('/new_post', authGuard, newPost);
router.get('/get_posts', getPosts);
router.post('/new_comment', newComment);
router.get('/get_comments/:postID', getComments);

module.exports = router;
