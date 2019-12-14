/* eslint-disable max-len */
// const firebase = require('firebase');
const HttpStatus = require('http-status-codes');
// const { validateCode } = require('../../util/validator');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const {
    somethingWentWrong,
} = message;
const {
    INTERNAL_SERVER_ERROR,
    CREATED,
} = HttpStatus;

const like = async (req, res, db, commentID) => {
    const {
        userID, postID,
    } = req.body;
    await db.doc(`/like_comment/${commentID}`).set({
        commentID,
        createdAt: new Date().toISOString(),
        postID,
        status: true,
        userID,
    });
    return res.status(CREATED).json({ data: req.body, status: success });
};

const errorsReturn = res => res
    .status(INTERNAL_SERVER_ERROR)
    .json({ message: somethingWentWrong, status: error });

const setLikeComment = async (req, res, db) => {
    try {
        return like(req, res, db, req.params.commentID);
    } catch (err) {
        return errorsReturn(res, err);
    }
};

module.exports = {
    setLikeComment,
};
