const { db } = require('../../util/admin');
const { setLikeComment } = require('./likeComment');
const { setUnLikeComment } = require('./unlikeComment');
const { getLikeStatus } = require('./likeCommentStatus');

const likeComment = (req, res) => setLikeComment(req, res, db);
const unlikeComment = (req, res) => setUnLikeComment(req, res, db);
const commentLikeStatus = (req, res) => getLikeStatus(req, res, db);

module.exports = {
    commentLikeStatus,
    likeComment,
    unlikeComment,
};
