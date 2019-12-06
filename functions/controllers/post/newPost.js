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

const createPost = async (req, res, db) => {
    const {
        topicID, title, thread, userID,
    } = req.body;
    await db.doc(`/posts/${title}`).set({
        createdAt: new Date().toISOString(),
        thread,
        title,
        topicID,
        userID,
    });
    return res.status(CREATED).json({ data: req.body, status: success });
};

const errorsReturn = res => res
    .status(INTERNAL_SERVER_ERROR)
    .json({ message: somethingWentWrong, status: error });

const addPost = async (req, res, db) => {
    // ensure unique data
    try {
        return createPost(req, res, db);
    } catch (err) {
        return errorsReturn(res, err);
    }
};

module.exports = {
    addPost,
};
