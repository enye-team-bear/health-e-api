const HttpStatus = require('http-status-codes');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;
const { INTERNAL_SERVER_ERROR, OK } = HttpStatus;

const returnTopicsOfInterest = async (req, res, topics) => {
    const topic = [];
    topics.forEach(doc => {
        topic.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return res.status(OK).json({ data: topic, status: success });
};

const errorsReturn = res => {
    res.status(INTERNAL_SERVER_ERROR).json({
        message: somethingWentWrong,
        status: error,
    });
};

const getTopicsOfInterest = async (req, res, db) => {
    try {
        const topicsOfInterest = await db
            .collection('topicsOfInterests')
            .where('userName', '==', req.user.userName)
            .get();
        return returnTopicsOfInterest(req, res, topicsOfInterest);
    } catch (err) {
        return errorsReturn(res, err);
    }
};

module.exports = {
    getTopicsOfInterest,
};
