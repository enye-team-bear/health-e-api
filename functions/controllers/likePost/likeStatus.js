const HttpStatus = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { OK, INTERNAL_SERVER_ERROR } = HttpStatus;
const { error, success } = status;
const { somethingWentWrong } = message;

const getStatus = async (req, res, db) => {
    // Create a 'where' query against the collection to get like status of the speficified post.
    const likeStatus = await db
        .collection('comments')
        .where('postID', '==', `${req.params.postID}`)
        .where('userID', '==', `${req.params.userID}`).get();
    return res.status(OK).json({ data: likeStatus, status: success });
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
