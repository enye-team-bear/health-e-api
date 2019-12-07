const { db } = require('../../util/admin');
const { like } = require('./like');
const { unlike } = require('./unlike');
const { likeStatus } = require('./likeStatus');

const likePost = (req, res) => like(req, res, db);
const unlikePost = (req, res) => unlike(req, res, db);
const postlikeStatus = (req, res) => likeStatus(req, res, db);

module.exports = {
    likePost,
    postlikeStatus,
    unlikePost,
};
