const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = HttpStatus;
const { error, success } = status;
const { somethingWentWrong } = message;

const mapResult = async (res, likeStatus) => {
    const statusT = [];
    likeStatus.forEach(doc => {
        statusT.push(
            _.pick(doc.data(), [
                'createdAt',
                'status',
                'commentID',
                'postID',
                'userID',
            ]),
        );
    });
    return res.status(OK).json({ data: statusT, status: success });
};

const getStatus = async (req, res, db) => {
    // Create a 'where' query against the collection to get like status of the speficified Comment.
    const likeStatus = await db
        .collection('like_comment')
        .where('CommentID', '==', `${req.params.commentID}`)
        .where('userID', '==', `${req.params.userID}`).get();

    if (!likeStatus) {
        return res
            .status(BAD_REQUEST)
            .json({ message: somethingWentWrong, status: error });
    }
    return mapResult(res, likeStatus);
};

const getLikeStatus = async (req, res, db) => {
    try {
        return getStatus(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getLikeStatus,
};
