const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const postMessage = async (req, res, Post) => {
    await Post;
    res.status(OK).json({ data: Post, status: success });
};

const getCommentAndLikes = async (req, res, db, doc) => {
    const Post = doc.data();
    Post.postId = doc.id;
    Post.comments = [];
    Post.likes = [];
    const comments = await db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('postId', '==', req.params.postId)
        .get();
    comments.forEach(comment => Post.comments.push(comment.data()));
    const likes = await db
        .collection('likes')
        .where('postId', '==', req.params.postId)
        .get();
    likes.forEach(like => Post.likes.push(like.data()));
    return postMessage(req, res, Post);
};

const getPost = async (req, res, db) => {
    const doc = await db.doc(`/posts/${req.params.postId}`).get();
    if (!doc.exists) {
        res.status(BAD_REQUEST).json({
            message: somethingWentWrong,
            status: error,
        });
    }
    return getCommentAndLikes(req, res, db, doc);
};

const getPostById = (req, res, db) => {
    try {
        return getPost(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getPostById,
};
