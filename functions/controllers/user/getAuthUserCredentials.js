const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const mapUsers = async (res, users) => {
    const user = users.data();
    return res.status(OK).json({ data: user, status: success });
};

const getUser = async (req, res, db) => {
    const { userName } = req.user;
    const usersName = userName;
    const users = await db
        .collection('users')
        .doc(usersName)
        .get();
    if (!users) {
        return res
            .status(BAD_REQUEST)
            .json({ message: somethingWentWrong, status: error });
    }
    return mapUsers(res, users);
};

const getAuthUserCredentials = async (req, res, db) => {
    try {
        return getUser(req, res, db);
    } catch (errors) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: errors });
    }
};

module.exports = {
    getAuthUserCredentials,
};
