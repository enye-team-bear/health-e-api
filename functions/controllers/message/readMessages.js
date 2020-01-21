const HttpStatus = require('http-status-codes');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong, chatSessionDoesnotExist } = message;
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
            message: chatSessionDoesnotExist,
            status: error,
        });
    },
};

const successMessage = {
    success1: (res, chats) => {
        res.status(OK).json({
            message: chats,
            status: success,
        });
    },
};

const getMessages = async (req, res, db) => {
    const chats = [];
    try {
        const messages = await db
            .collection('messages')
            .where('roomId', '==', req.params.roomId)
            .get();
        messages.docs.forEach(async mes => {
            chats.push(mes.data());
        });
        return successMessage.success1(res, chats);
    } catch (err) {
        return errors.error2(res);
    }
};

const markMessageRead = async (req, res, db, messages) => {
    try {
        await messages.docs.forEach(async mes => {
            if (req.user.uid === mes.data().reciever) {
                await db
                    .collection('messages')
                    .doc(mes.id)
                    .update({
                        read: true,
                        unread: false,
                    });
            }
        });
        return getMessages(req, res, db);
    } catch (err) {
        return errors.error2(res);
    }
};

const readMessages = async (req, res, db) => {
    try {
        const room = await db.doc(`/rooms/${req.params.roomId}`).get();
        if (room.data() && room.data().participant2 === req.user.uid) {
            return getMessages(req, res, db);
        }
        if (room.data() && room.data().participant1 === req.user.uid) {
            const messages = await db
                .collection('messages')
                .where('roomId', '==', req.params.roomId)
                .get();
            if (messages.docs[0].data()) {
                return markMessageRead(req, res, db, messages);
            }
        }
        return errors.error3(res);
    } catch (err) {
        return errors.error2(res);
    }
};

module.exports = readMessages;
