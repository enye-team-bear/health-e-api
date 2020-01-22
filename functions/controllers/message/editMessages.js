/* eslint-disable operator-linebreak */
const HttpStatus = require('http-status-codes');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const {
    somethingWentWrong,
    messageDoestNotExist,
    messageUpdatedSuccessfully,
} = message;
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = HttpStatus;

const errors = {
    error2: res => {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: somethingWentWrong,
            status: error,
        });
    },
    error3: res => {
        res.status(BAD_REQUEST).json({
            message: messageDoestNotExist,
            status: error,
        });
    },
};

const successMessage = {
    success1: res => {
        res.status(OK).json({
            message: messageUpdatedSuccessfully,
            status: success,
        });
    },
};

const edit = async (req, res, db) => {
    try {
        await db.doc(`/messages/${req.params.messageId}`).update({
            message: req.body.message,
        });
        return successMessage.success1(res);
    } catch (err) {
        return errors.error2(res);
    }
};

const editMessages = async (req, res, db) => {
    try {
        const messages = await db
            .doc(`/messages/${req.params.messageId}`)
            .get();
        if (
            messages.data() &&
            messages.data().sender === req.user.uid &&
            messages.data().read
        ) {
            return edit(req, res, db);
        }
        return errors.error3(res);
    } catch (err) {
        return errors.error2(res);
    }
};

module.exports = editMessages;
