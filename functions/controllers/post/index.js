const { db } = require('../../util/admin');
const { addPost } = require('./newPost');
const { getAllPosts } = require('./getPost');
const { addComments } = require('./addComment');
const { likePost } = require('./likePost');
const { unlikePost } = require('./unlikePost');
const { getPostById } = require('./getPostById');
const { getLikeStatus } = require('./getLikeStatusById');

const getPosts = (req, res) => getAllPosts(req, res, db);
const newPost = (req, res) => addPost(req, res, db);
const comment = (req, res) => addComments(req, res, db);
const like = (req, res) => likePost(req, res, db);
const unlike = (req, res) => unlikePost(req, res, db);
const getPostId = (req, res) => getPostById(req, res, db);
const getLikeStatusById = (req, res) => getLikeStatus(req, res, db);

module.exports = {
    comment,
    getLikeStatusById,
    getPostId,
    getPosts,
    like,
    newPost,
    unlike,
};
