/* eslint-disable no-tabs */
/* eslint-disable prefer-destructuring */
const httpStatus = require('http-status-codes');
const { admin, db } = require('./admin');
const { configConstants, status, message } = require('./constants');

const { UNAUTHORIZED } = httpStatus;
const { error, fail } = status;
const { unAuthorized, somethingWentWrong } = message;
const { userId, users } = configConstants;

const checkAuth = async (req, idToken, next) => {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    const user = await db
        .collection(users)
        .where(userId, '==', decodedToken.uid)
        .limit(1)
        .get();
    req.user.userName = user.docs[0].data().userName;
    req.user.imageUrl = user.docs[0].data().imageUrl;
    return next();
};

module.exports = async (req, res, next) => {
    let idToken;
    try {
        if (
            req.headers.authorization
			&& req.headers.authorization.startsWith('Bearer ')
        ) {
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else {
            return res
                .status(UNAUTHORIZED)
                .json({ message: unAuthorized, status: fail });
        }
        return checkAuth(req, idToken, next);
    } catch (err) {
        return res
            .status(unAuthorized)
            .json({ message: somethingWentWrong, status: error });
    }
};
