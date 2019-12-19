/* eslint-disable max-len */
// const firebase = require('firebase');
const HttpStatus = require('http-status-codes');
// const { validateCode } = require('../../util/validator');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const {
    somethingWentWrong,
    topicExists,
} = message;
const {
    INTERNAL_SERVER_ERROR,
    CREATED,
    CONFLICT,
} = HttpStatus;

const createTopic = async (req, res, db) => {
    const {
        topic,
    } = req.body;
    const newTopic = {
        createdAt: new Date().toISOString(),
        topic,
        userId: req.user.uid,
    };
    await db.collection('topics').add(newTopic);
    return res.status(CREATED).json({ data: topic, status: success });
};

const errorsReturn = res => res
    .status(INTERNAL_SERVER_ERROR)
    .json({ message: somethingWentWrong, status: error });

const addTopic = async (req, res, db) => {
    const { topic } = req.body;
    // ensure unique data
    try {
        const docu = await db.collection('topics').where('topic', '==', topic).get();
        if (docu.docs[0]) {
            const file = docu.docs[0].data().topic;
            if (file === topic) {
                return res.status(CONFLICT).json({
                    message: topicExists,
                    status: error,
                });
            }
        }
        return createTopic(req, res, db);
    } catch (err) {
        console.log(err);
        return errorsReturn(res, err);
    }
};

module.exports = {
    addTopic,
};
