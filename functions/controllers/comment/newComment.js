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

const createComment = async (req, res, db) => {
    const {
        postID, thread, userID,
    } = req.body;
    await db.doc(`/comments/${postID}`).set({
        createdAt: new Date().toISOString(),
        postID,
        thread,
        userID,
    });
    return res.status(CREATED).json({ data: req.body, status: success });
};

const errorsReturn = res => res
    .status(INTERNAL_SERVER_ERROR)
    .json({ message: somethingWentWrong, status: error });

const addComment = async (req, res, db) => {
    // ensure unique data
    try {
        return createComment(req, res, db);
    } catch (err) {
        return errorsReturn(res, err);
    }
};

module.exports = {
    addComment,
};
