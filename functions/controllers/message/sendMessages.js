const HttpStatus = require('http-status-codes');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong, messageSent } = message;
const { INTERNAL_SERVER_ERROR, OK } = HttpStatus;

const errors = {
    error2: res => {
        res.status(INTERNAL_SERVER_ERROR).json({
            message: somethingWentWrong,
            status: error,
        });
    },
};

const successMessage = {
    success1: res => {
        res.status(OK).json({
            message: messageSent,
            status: success,
        });
    },
};

// eslint-disable-next-line max-lines-per-function
const sendMessage = async (req, res, db) => {
    try {
        const roomReverse = await db
            .doc(`/rooms/${req.user.uid + req.params.recieverId}`)
            .get();
        if (roomReverse.data()) {
            await db.collection('messages').add({
                createdAt: new Date().toISOString(),
                message: req.body.message,
                read: false,
                reciever: req.params.recieverId,
                roomId: req.user.uid + req.params.recieverId,
                sender: req.user.uid,
                unread: true,
            });
            return successMessage.success1(res);
        }
        await db.collection('messages').add({
            createdAt: new Date().toISOString(),
            message: req.body.message,
            read: false,
            reciever: req.params.recieverId,
            roomId: req.params.recieverId + req.user.uid,
            sender: req.user.uid,
            unread: true,
        });
        return successMessage.success1(res);
    } catch (err) {
        return errors.error2(res);
    }
};

const createRoom = async (req, res, db) => {
    try {
        await db
            .collection('rooms')
            .doc(req.params.recieverId + req.user.uid)
            .set({
                createdAt: new Date().toISOString(),
                participant1: req.params.recieverId,
                participant2: req.user.uid,
            });
        return sendMessage(req, res, db);
    } catch (err) {
        return errors.error2(res);
    }
};

const sendMessages = async (req, res, db) => {
    try {
        const room = await db
            .doc(`/rooms/${req.params.recieverId + req.user.uid}`)
            .get();

        const roomReverse = await db
            .doc(`/rooms/${req.user.uid + req.params.recieverId}`)
            .get();
        if (roomReverse.data()) {
            return sendMessage(req, res, db);
        }
        if (room.data() === undefined) {
            return createRoom(req, res, db);
        }
        return sendMessage(req, res, db);
    } catch (err) {
        return errors.error2(res);
    }
};

module.exports = sendMessages;
