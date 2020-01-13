const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const _ = require('lodash');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong, updateSuccessful } = message;

const setData = async (req, res, db) => {
    await db
        .collection('users')
        .doc(req.user.userName)
        .set(
            _.pick(req.body, [
                'fullName',
                'description',
                'profession',
                'currentTitle',
                'currentJob',
                'number',
            ]),
            { merge: true },
        );
    res.status(OK).json({
        message: updateSuccessful,
        status: success,
    });
};

const userUpdate = async (req, res, db) => {
    try {
        const user = await db.doc(`/users/${req.user.userName}`).get();
        if (!user.data()) {
            throw error;
        }
        return setData(req, res, db);
    } catch (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: somethingWentWrong,
            status: error,
        });
    }
};

module.exports = {
    userUpdate,
};
