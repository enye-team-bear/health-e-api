const { db } = require('../../util/admin');
const { likeComment } = require('./likeComment');
const { unlikeComment } = require('./unlikeComment');
const { commentLikeStatus } = require('./getCommentLikeStatusById');

const likeComments = (req, res) => likeComment(req, res, db);
const unlikeComments = (req, res) => unlikeComment(req, res, db);
const commentLikeStatusById = (req, res) => commentLikeStatus(req, res, db);

module.exports = {
    commentLikeStatusById,
    likeComments,
    unlikeComments,
};
