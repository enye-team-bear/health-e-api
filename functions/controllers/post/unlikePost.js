/* eslint-disable indent */
/* eslint-disable no-tabs */
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { postNotLiked, somethingWentWrong, postNotFound } = message;

let postData;

const unlikePosts = async (req, res, db, postDoc, file) => {
    await db.doc(`/likes/${file.docs[0].id}`).delete();
    // eslint-disable-next-line no-plusplus
    postData.likeCount--;
    await postDoc.update({ likeCount: postData.likeCount });
    return res.status(OK).json({ data: postData, status: success });
};

const verifyUnLike = async (req, res, post, db, likeDoc, postDoc) => {
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
        return res
            .status(BAD_REQUEST)
            .json({ message: postNotLiked, status: error });
    }
    return unlikePosts(req, res, db, postDoc, file);
};

const unlike = async (req, res, db) => {
    const likeDoc = await db
        .collection('likes')
        .where('userName', '==', req.user.userName)
        .where('postId', '==', req.params.postId)
        .limit(1);
    const postDoc = db.doc(`/posts/${req.params.postId}`);
    const post = await postDoc.get();
    return verifyUnLike(req, res, post, db, likeDoc, postDoc);
};

const unlikePost = async (req, res, db) => {
    try {
        await unlike(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    unlikePost,
};
