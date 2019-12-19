/* eslint-disable no-tabs */
/* eslint-disable indent */
const { db } = require('../../util/admin');
const { addPost } = require('./newPost');
const { getAllPosts } = require('./getPost');
const { addComments } = require('./addComment');
const { likePost } = require('./likePost');
const { unlikePost } = require('./unlikePost');

const getPosts = (req, res) => getAllPosts(req, res, db);
const newPost = (req, res) => addPost(req, res, db);
const comment = (req, res) => addComments(req, res, db);
const like = (req, res) => likePost(req, res, db);
const unlike = (req, res) => unlikePost(req, res, db);
module.exports = {
	comment,
	getPosts,
	like,
	newPost,
	unlike,
};
