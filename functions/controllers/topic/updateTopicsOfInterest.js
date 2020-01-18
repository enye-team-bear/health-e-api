const HttpStatus = require('http-status-codes');
// const { validateCode } = require('../../util/validator');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;
const { INTERNAL_SERVER_ERROR, CREATED } = HttpStatus;

const createTopicsOfInterest = async (req, res, db) => {
    const { stringifiedJson } = req.body;
    const newTopicsOfInterest = {
        createdAt: new Date().toISOString(),
        stringifiedJson,
        userName: req.user.userName,
    };
    await db.collection('topicsOfInterests').add(newTopicsOfInterest);
    return res.status(CREATED).json({ data: newTopicsOfInterest, status: success });
};

const errorsReturn = res => {
    res.status(INTERNAL_SERVER_ERROR).json({
        message: somethingWentWrong,
        status: error,
    });
};

const cleanDB = async (req, res, db, docu) => {
    await db.doc(`/likeComment/${docu.docs[0].id}`).delete();
    return createTopicsOfInterest(req, res, db);
};

const addTopicsOfInterest = async (req, res, db) => {
    try {
        const docu = await db
            .collection('topicsOfInterests')
            .get();
        return cleanDB(req, res, db, docu);
    } catch (err) {
        return errorsReturn(res, err);
    }
};

module.exports = {
    addTopicsOfInterest,
};
