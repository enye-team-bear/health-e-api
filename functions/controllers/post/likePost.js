/* eslint-disable indent */
/* eslint-disable no-tabs */
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { postAlreadyLiked, somethingWentWrong, postNotFound } = message;

let postData;

const likePosts = async (req, res, db, likeDoc, postDoc) => {
    await db.collection('likes').add({
        postId: req.params.postId,
        userName: req.user.userName,
    });
    // eslint-disable-next-line no-plusplus
    postData.likeCount++;
    await postDoc.update({ likeCount: postData.likeCount });
    return res.status(OK).json({ data: postData, status: success });
};

const verifyLike = async (req, res, post, db, likeDoc, postDoc) => {
    let file;
    if (post.exists) {
        postData = post.data();
        postData.postId = post.id;
        file = await likeDoc.get();
    } else {
        return res
            .status(BAD_REQUEST)
            .json({ message: postNotFound, status: error });
    }
    if (file.empty) {
        return likePosts(req, res, db, likeDoc, postDoc);
    }
    return res
        .status(BAD_REQUEST)
        .json({ message: postAlreadyLiked, status: error });
};

const like = async (req, res, db) => {
    const likeDoc = await db
        .collection('likes')
        .where('userName', '==', req.user.userName)
        .where('postId', '==', req.params.postId)
        .limit(1);
    const postDoc = db.doc(`/posts/${req.params.postId}`);
    const post = await postDoc.get();
    return verifyLike(req, res, post, db, likeDoc, postDoc);
};

const likePost = async (req, res, db) => {
    try {
        await like(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    likePost,
};
