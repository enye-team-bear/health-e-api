const { db } = require('../../util/admin');
const { like } = require('./likeComment');
const { unlike } = require('./unlikeComment');

const likeComment = (req, res) => like(req, res, db);
const unlikeComment = (req, res) => unlike(req, res, db);

module.exports = {
    likeComment,
    unlikeComment,
};
