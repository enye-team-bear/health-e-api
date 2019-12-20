const { db } = require('../../util/admin');
const { addTopic } = require('./newTopic');
const { getAllTopics } = require('./getTopic');
const { addComments } = require('./addComment');
const { likeTopic } = require('./likeTopic');
const { unlikeTopic } = require('./unlikeTopic');

const getTopics = (req, res) => getAllTopics(req, res, db);
const newTopic = (req, res) => addTopic(req, res, db);
const commentOnTopic = (req, res) => addComments(req, res, db)
const likeTop = (req, res) => likeTopic(req, res, db)
const unlikeTop = (req, res) => unlikeTopic(req, res, db)

module.exports = {
    commentOnTopic,
    getTopics,
    likeTop,
    newTopic,
    unlikeTop
};
