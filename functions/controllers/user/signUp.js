const firebase = require('firebase');
const _ = require('lodash');
const {
    PRECONDITION_FAILED,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    CREATED,
    CONFLICT,
} = require('http-status-codes');
const { validateSignUpData } = require('../../util/validator');
const { configConstants, status, message } = require('../../util/constants');

const { error, success } = status;
const {
    somethingWentWrong,
    emailInUse,
    authEmailInUse,
    userNameExists,
} = message;
const { defaultImg } = configConstants;
// eslint-disable-next-line max-len
const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${defaultImg}?alt=media`;

const storeUser = async (req, res, db, userId, token) => {
    const {
        email, number, userStatus, userName, fullName,
    } = req.body;
    await db.doc(`/users/${userName}`).set({
        createdAt: new Date().toISOString(),
        email,
        fullName,
        imageUrl,
        number,
        userId,
        userName,
        userStatus,
    });
    return res.status(CREATED).json({ data: token, status: success });
};

const createUser = async (req, res, db) => {
    const { email, password } = req.body;
    const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
    const userId = await user.user.uid;
    const token = await user.user.getIdToken();
    storeUser(req, res, db, userId, token);
};

const errorsReturn = (res, err) => {
    if (err.code === authEmailInUse) {
        return res
            .status(BAD_REQUEST)
            .json({ message: emailInUse, status: error });
    }
    return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: somethingWentWrong, status: error });
};

// eslint-disable-next-line consistent-return
const validateCode = (req, res) => {
    // validating input
    const { valid, errors } = validateSignUpData(
        _.pick(req.body, [
            'fullName',
            'userName',
            'email',
            'number',
            'password',
            'confirmPassword',
            'userStatus',
        ]),
    );
    if (!valid) {
        return res
            .status(PRECONDITION_FAILED)
            .json({ message: errors, status: error });
    }
};

const signupUser = async (req, res, db) => {
    validateCode(req, res);
    // ensuring user does not exist in db.. using unique username
    try {
        /** i used req.body.userName instead
of destructuring because it is the only thing i am getting from req */
        const docu = await db.doc(`/users/${req.body.userName}`).get();
        if (docu.exists) {
            return res.status(CONFLICT).json({
                message: userNameExists,
                status: error,
            });
        }
        return createUser(req, res, db);
    } catch (err) {
        return errorsReturn(res, err);
    }
};

module.exports = {
    signupUser,
};
