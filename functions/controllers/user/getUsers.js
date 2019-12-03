const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = HttpStatus;
const { error, success } = status;
const { somethingWentWrong } = message;

const mapUsers = async (res, users) => {
    const user = [];
    users.forEach(doc => {
        user.push(
            _.pick(doc.data(), [
                'createdAt',
                'email',
                'fullName',
                'imageUrl',
                'number',
                'userId',
                'userName',
                'userStatus',
            ]),
        );
    });
    return res.status(OK).json({ data: user, status: success });
};

const getUser = async (res, db) => {
    const users = await db.collection('users').get();
    if (!users) {
        return res
            .status(BAD_REQUEST)
            .json({ message: somethingWentWrong, status: error });
    }
    return mapUsers(res, users);
};

const getAllUser = async (req, res, db) => {
    try {
        return getUser(res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getAllUser,
};
