/* eslint-disable no-tabs */
/* eslint-disable indent */
const { db } = require('../../util/admin');
const { addPost } = require('./newPost');
const { getAllPosts } = require('./getPost');
const { addComments } = require('./addComment');

const getPosts = (req, res) => getAllPosts(req, res, db);
const newPost = (req, res) => addPost(req, res, db);
const comment = (req, res) => addComments(req, res, db);
module.exports = {
	comment,
	getPosts,
	newPost,
};
