const { db } = require('../../util/admin');
const sendMessages = require('./sendMessages');
const readMessages = require('./readMessages');

const sendMessage = (req, res) => sendMessages(req, res, db);
const readMessage = (req, res) => readMessages(req, res, db);

module.exports = {
    readMessage,
    sendMessage,
};
