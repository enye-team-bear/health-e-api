const { db } = require('../../util/admin');
const { addPost } = require('./newPost');
const { getAllPosts } = require('./getPost');

const getPosts = (req, res) => getAllPosts(req, res, db);
const newPost = (req, res) => addPost(req, res, db);

module.exports = {
    getPosts,
    newPost,
};
