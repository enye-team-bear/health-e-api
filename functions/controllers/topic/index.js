const { db } = require('../../util/admin');
const { addTopic } = require('./newTopic');
const { getAllTopics } = require('./getTopic');

const getTopics = (req, res) => getAllTopics(req, res, db);
const newTopic = (req, res) => addTopic(req, res, db);

module.exports = {
    getTopics,
    newTopic,
};
