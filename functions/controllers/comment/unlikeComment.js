const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { commentNotLiked, somethingWentWrong, commentNotFound } = message;

let commentData;

const unlikeComments = async (req, res, db, commentDoc, file) => {
    await db.doc(`/likes/${file.docs[0].id}`).delete();
    commentData.likeCount -= 1;
    await commentDoc.update({ likeCount: commentData.likeCount });
    return res.status(OK).json({ data: commentData, status: success });
};

const verifyUnLike = async (req, res, comment, db, likeDoc, commentDoc) => {
    let file;
    if (comment.exists) {
        commentData = comment.data();
        commentData.commentId = comment.id;
        file = await likeDoc.get();
    } else {
        return res
            .status(BAD_REQUEST)
            .json({ message: commentNotFound, status: error });
    }
    if (file.empty) {
        return res
            .status(BAD_REQUEST)
            .json({ message: commentNotLiked, status: error });
    }
    return unlikeComments(req, res, db, commentDoc, file);
};

const unlike = async (req, res, db) => {
    const likeDoc = await db
        .collection('likes')
        .where('userName', '==', req.user.userName)
        .where('commentId', '==', req.params.commentId)
        .limit(1);
    const commentDoc = db.doc(`/comments/${req.params.commentId}`);
    const comment = await commentDoc.get();
    return verifyUnLike(req, res, comment, db, likeDoc, commentDoc);
};

const unlikeComment = async (req, res, db) => {
    try {
        await unlike(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    unlikeComment,
};
