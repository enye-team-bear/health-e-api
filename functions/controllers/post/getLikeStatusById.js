const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const likeStatus = async (req, res, likeState) => {
    await likeState;
    res.status(OK).json({ data: likeState, status: success });
};

const getLikeStatus = async (req, res, db) => {
    const doc = await db.doc(`/likes/${req.params.postId}`)
        .where('userName', '==', req.user.userName).get();
    let likeState = false;
    if (!doc.exists) {
        return likeStatus(req, res, likeState);
    }
    likeState = true;
    return likeStatus(req, res, likeState);
};

const getLikeStatusById = (req, res, db) => {
    try {
        return getLikeStatus(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getLikeStatusById,
};
