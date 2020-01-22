const { db } = require('../../util/admin');
const sendMessages = require('./sendMessages');
const readMessages = require('./readMessages');
const editMessages = require('./editMessages');

const sendMessage = (req, res) => sendMessages(req, res, db);
const readMessage = (req, res) => readMessages(req, res, db);
const editMessage = (req, res) => editMessages(req, res, db);

module.exports = {
    editMessage,
    readMessage,
    sendMessage,
};
