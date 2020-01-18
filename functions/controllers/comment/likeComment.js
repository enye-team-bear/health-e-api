const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { ERROR, SUCCESS } = status;
const { commentAlreadyLiked, somethingWentWrong, commentNotFound } = message;

let commentData;

const likeComments = async (req, res, db, likeDoc, commentDoc) => {
    await db.collection('likeComment').add({
        commentId: req.params.commentId,
        createdAt: new Date().toISOString(),
        userName: req.user.userName,
    });
    commentData.likeCount = 0;
    commentData.likeCount += 1;
    await commentDoc.set({ likeCount: commentData.likeCount }, { merge: true });
    return res.status(OK).json({ data: commentData, status: SUCCESS });
};

const verifyLike = async (req, res, comment, db, likeDoc, commentDoc) => {
    let file;
    if (comment.exists) {
        commentData = comment.data();
        commentData.commentId = comment.id;
        file = await likeDoc.get();
    } else {
        return res
            .status(BAD_REQUEST)
            .json({ message: commentNotFound, status: ERROR });
    }
    if (file.empty) {
        return likeComments(req, res, db, likeDoc, commentDoc);
    }
    return res
        .status(BAD_REQUEST)
        .json({ message: commentAlreadyLiked, status: ERROR });
};

const like = async (req, res, db) => {
    const likeDoc = await db
        .collection('likes')
        .where('userName', '==', req.user.userName)
        .where('commentId', '==', req.params.commentId)
        .limit(1);
    const commentDoc = db.doc(`/comments/${req.params.commentId}`);
    const comment = await commentDoc.get();
    return verifyLike(req, res, comment, db, likeDoc, commentDoc);
};

const likeComment = async (req, res, db) => {
    try {
        return like(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: ERROR });
    }
};

module.exports = {
    likeComment,
};
