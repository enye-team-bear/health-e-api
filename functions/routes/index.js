const express = require('express');

const router = express.Router();
const authGuard = require('../util/authGuard');

const {
    login, signUp, image, getAll,
} = require('../controllers/user/index');

const {
    newTopic, getTopics,
} = require('../controllers/topic/index');

const {
    newPost, getPosts,
} = require('../controllers/post/index');

const {
    newComment, getComments,
} = require('../controllers/comment/index');

const {
    likePost, unlikePost, postLikeStatus,
} = require('../controllers/likePost/index');

const {
    likeComment, unlikeComment, commentLikeStatus,
} = require('../controllers/likeComment/index');

// user Routes
router.post('/signup', signUp);
router.post('/login', login);
router.put('/user/image', authGuard, image);
router.get('/users', getAll);
router.post('/new_topic', newTopic);
router.get('/get_topics', getTopics);
router.post('/new_post', newPost);
router.get('/get_posts', getPosts);
router.post('/new_comment', newComment);
router.get('/get_comments/:postID', getComments);

router.post('/like_post/:postID', likePost);
router.post('/unlike_post/:postID', unlikePost);
router.post('/post_like_status/:postID', postLikeStatus);

router.post('/like_comment/:commentID', likeComment);
router.post('/unlike_comment/:commentID', unlikeComment);
router.post('/comment_like_status/:commentID', commentLikeStatus);

module.exports = router;
