const { db } = require('../../util/admin');
const { setLikePost } = require('./like');
const { setUnLikePost } = require('./unlike');
const { getLikeStatus } = require('./likeStatus');

const likePost = (req, res) => setLikePost(req, res, db);
const unlikePost = (req, res) => setUnLikePost(req, res, db);
const postLikeStatus = (req, res) => getLikeStatus(req, res, db);

module.exports = {
    likePost,
    postLikeStatus,
    unlikePost,
};
