const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong, userNotFound } = message;

const mapUsers = async (res, users) => {
    const user = users.data();
    return res.status(OK).json({ data: user, status: success });
};

const getUser = async (req, res, db) => {
    const { userName } = req.params;
    const usersName = userName;
    const users = await db.collection('users').doc(usersName).get();
    if (!users || users.data() === undefined) {
        return res
            .status(BAD_REQUEST)
            .json({ message: userNotFound, status: error });
    }
    return mapUsers(res, users);
};

const getAUser = async (req, res, db) => {
    try {
        await getUser(req, res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getAUser,
};
