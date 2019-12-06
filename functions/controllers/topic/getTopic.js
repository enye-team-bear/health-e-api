const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = HttpStatus;
const { error, success } = status;
const { somethingWentWrong } = message;

const mapTopics = async (res, topics) => {
    const topic = [];
    topics.forEach(doc => {
        topic.push(
            _.pick(doc.data(), [
                'createdAt',
                'topic',
            ]),
        );
    });
    return res.status(OK).json({ data: topic, status: success });
};

const getTopic = async (res, db) => {
    const topics = await db.collection('topics').get();
    if (!topics) {
        return res
            .status(BAD_REQUEST)
            .json({ message: somethingWentWrong, status: error });
    }
    return mapTopics(res, topics);
};

const getAllTopics = async (req, res, db) => {
    try {
        return getTopic(res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getAllTopics,
};
