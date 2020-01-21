const { db } = require('../../util/admin');
const sendMessages = require('./sendMessages');

const sendMessage = (req, res) => sendMessages(req, res, db);

module.exports = {
    sendMessage,
};
