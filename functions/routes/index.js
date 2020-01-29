const express = require('express');
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } = require('http-status-codes');
const { message, status } = require('../util/constants');
const { db } = require('../util/admin');

const { somethingWentWrong, notificationRead } = message;
const { error, success } = status;
const router = express.Router();
const authGuard = require('../util/authGuard');

const {
    login,
    signUp,
    image,
    getAll,
    getUserById,
    coverPhoto,
    AuthUserCredentials,
    sendFriendRequest,
    updateUser,
} = require('../controllers/user/index');

const {
    newTopic,
    getTopics,
    commentOnTopic,
    likeTop,
    unlikeTop,
    getTopic,
} = require('../controllers/topic/index');

const {
    sendMessage,
    readMessage,
    editMessage,
} = require('../controllers/message/index');

const {
    newPost,
    getPostId,
    getPosts,
    comment,
    like,
    unlike,
} = require('../controllers/post/index');

const {
    likeComments,
    unlikeComments,
} = require('../controllers/comment/index');

// user Routes
router.get('/', (req, res) => {
    res.status(404).send('moses');
});
router.post('/signup', signUp);
router.post('/login', login);
router.put('/user/image', authGuard, image);
router.put('/user/coverimage', authGuard, coverPhoto);
router.post('/user/:userName/requestFriend', authGuard, sendFriendRequest);
router.get('/users', getAll);
router.get('/user', authGuard, AuthUserCredentials);
router.put('/user', authGuard, updateUser);
router.get('/user/:userName', getUserById);
router.post('/new_topic', authGuard, newTopic);
router.get('/topics', getTopics);
router.get('/topic/:topicId', getTopic);
router.post('/topic/:topicId/comment', authGuard, commentOnTopic);
router.get('/topic/:topicId/like', authGuard, likeTop);
router.get('/topic/:topicId/unlike', authGuard, unlikeTop);
router.post('/post/:postId/comment', authGuard, comment);
router.get('/post/:postId', getPostId);
router.get('/post/:postId/like', authGuard, like);
router.get('/post/:postId/unlike', authGuard, unlike);
router.post('/new_post', authGuard, newPost);
router.get('/posts', getPosts);
router.get('/comment/:commentId/like', authGuard, likeComments);
router.get('/comment/:commentId/unlike', authGuard, unlikeComments);
router.post('/message/:recieverId', authGuard, sendMessage);
router.get('/message/:roomId', authGuard, readMessage);
router.put('/message/:messageId', authGuard, editMessage);

// notification route

const markNotifications = async (req, res) => {
    try {
        await db.doc(`/notifications/${req.params.id}`).update({ read: true });
        res.status(OK).json({
            message: notificationRead,
            status: success,
        });
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: somethingWentWrong,
            status: error,
        });
    }
};

router.put('/notification/:id', authGuard, async (req, res) => {
    try {
        const notifications = await db
            .collection('notifications')
            .doc(req.params.id)
            .get();
        if (notifications.data() !== undefined) {
            markNotifications(req, res);
        }
    } catch (err) {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: somethingWentWrong,
            status: error,
        });
    }
});

module.exports = router;
