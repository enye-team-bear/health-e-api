const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const commentLikeStatus = async (req, res, commentLikeState) => {
    await commentLikeState;
    res.status(OK).json({ data: commentLikeState, status: success });
};

const getcommentLikeStatus = async (req, res, db) => {
    const doc = await db.doc(`/likeComment/${req.params.postId}`)
        .where('userName', '==', req.user.userName).get();
    let commentLikeState = false;
    if (!doc.exists) {
        return commentLikeStatus(req, res, commentLikeState);
    }
    commentLikeState = true;
    return commentLikeStatus(req, res, commentLikeState);
};

const getcommentLikeStatusById = (req, res, db) => {
    try {
        return getcommentLikeStatus(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getcommentLikeStatusById,
};
