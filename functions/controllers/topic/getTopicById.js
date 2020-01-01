const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const topicMessage = async (req, res, Topic) => {
    await Topic;
    res.status(OK).json({ data: Topic, status: success });
};

const getCommentAndLikes = async (req, res, db, doc) => {
    const Topic = doc.data();
    Topic.topicId = doc.id;
    Topic.comments = [];
    Topic.likes = [];
    const comments = await db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('topicId', '==', req.params.topicId)
        .get();
    comments.forEach(comment => Topic.comments.push(comment.data()));
    const likes = await db
        .collection('likes')
        .where('topicId', '==', req.params.topicId)
        .get();
    likes.forEach(like => Topic.likes.push(like.data()));
    return topicMessage(req, res, Topic);
};

const getTopic = async (req, res, db) => {
    const doc = await db.doc(`/topics/${req.params.topicId}`).get();
    if (!doc.exists) {
        res.status(BAD_REQUEST).json({
            message: somethingWentWrong,
            status: error,
        });
    }
    return getCommentAndLikes(req, res, db, doc);
};

const getTopicById = (req, res, db) => {
    try {
        return getTopic(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getTopicById,
};
