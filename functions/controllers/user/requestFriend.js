const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const {
    somethingWentWrong,
    userNotFound,
    requestAlreadySent,
    cannotFollowSelf,
    requestSent,
} = message;

const errors = {
    error1: res => {
        res.status(BAD_REQUEST).json({
            message: cannotFollowSelf,
            status: error,
        });
    },
    error2: res => {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: somethingWentWrong,
            status: error,
        });
    },
    error3: res => {
        res.status(BAD_REQUEST).json({
            message: userNotFound,
            status: error,
        });
    },
    error4: res => {
        res.status(BAD_REQUEST).json({
            message: requestAlreadySent,
            status: error,
        });
    },
};

const storeRequests = async (req, res, db, user) => {
    const { uid, imageUrl, userName } = req.user;
    await db.collection('requests').add({
        accepted: false,
        createdAt: new Date().toISOString(),
        from: {
            id: uid,
            image: imageUrl,
            userName,
        },
        rejected: false,
        to: user.data().userName,
    });
    return res.status(OK).json({
        message: requestSent,
        status: success,
    });
};

const sendRequest = async (req, res, db, user) => {
    try {
        const availableRequest = await db
            .collection('requests')
            .where('from.userName', '==', req.user.userName)
            .where('to', '==', req.params.userName)
            .limit(1)
            .get();
        if (!availableRequest.docs[0]) {
            return storeRequests(req, res, db, user);
        }
        return errors.error4(res);
    } catch (err) {
        return errors.error2(res);
    }
};

const requestFriend = async (req, res, db) => {
    try {
        if (req.user.userName === req.params.userName) {
            return errors.error1(res);
        }
        const user = await db
            .collection('users')
            .doc(`${req.params.userName}`)
            .get();
        if (user.data().userName) return sendRequest(req, res, db, user);
        return errors.error3(res);
    } catch (err) {
        return errors.error2(res);
    }
};

module.exports = {
    requestFriend,
};
