const firebase = require('firebase');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const { validateLoginData } = require('../../util/validator');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const {
    somethingWentWrong,
    wrongCredentials,
    authUserNotFound,
    authWrongPassword,
} = message;
const {
    PRECONDITION_FAILED,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    OK,
} = HttpStatus;

const user = {
    1: 2,
    3: 4,
    5: 6,
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userData = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
        const Token = await userData.user.getIdToken();
        console.log({ ..._.pick(user, ['1', '2']) });
        return res.status(OK).json({ data: Token, status: success });
    } catch (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            message: somethingWentWrong,
            status: error,
        });
    }
};

const errorsReturn = (res, err) => {
    if (err.code === authUserNotFound) {
        return res.status(BAD_REQUEST).json({
            message: wrongCredentials,
            status: error,
        });
    }
    if (err.code === authWrongPassword) {
        return res.status(BAD_REQUEST).json({
            message: wrongCredentials,
            status: error,
        });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({
        message: somethingWentWrong,
        status: error,
    });
};

const loginUser = async (req, res) => {
    const { errors, valid } = validateLoginData(
        _.pick(req.body, ['email', 'password']),
    );
    if (!valid) {
        return res
            .status(PRECONDITION_FAILED)
            .json({ message: errors, status: error });
    }

    try {
        return login(req, res);
    } catch (err) {
        return errorsReturn(res, err);
    }
};

module.exports = {
    loginUser,
};
