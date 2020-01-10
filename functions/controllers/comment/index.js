const { db } = require('../../util/admin');
const { likeComment } = require('./likeComment');
const { unlikeComment } = require('./unlikeComment');

const likeComments = (req, res) => likeComment(req, res, db);
const unlikeComments = (req, res) => unlikeComment(req, res, db);

module.exports = {
    likeComments,
    unlikeComments,
};
