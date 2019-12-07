const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = HttpStatus;
const { error, success } = status;
const { somethingWentWrong } = message;

const mapComments = async (res, comments) => {
    const comment = [];
    comments.forEach(doc => {
        comment.push(
            _.pick(doc.data(), [
                'createdAt',
                'thread',
                'postID',
                'userID',
            ]),
        );
    });
    return res.status(OK).json({ data: comment, status: success });
};

const getComment = async (req, res, db) => {
    // Create a 'where' query against the collection to get comments of the speficified post.
    const comments = await db
        .collection('comments')
        .where('postID', '==', `${req.params.postID}`).get();
    if (!comments) {
        return res
            .status(BAD_REQUEST)
            .json({ message: somethingWentWrong, status: error });
    }
    return mapComments(res, comments);
};

const getAllComments = async (req, res, db) => {
    try {
        return getComment(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getAllComments,
};
