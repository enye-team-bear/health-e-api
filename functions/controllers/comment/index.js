const { db } = require('../../util/admin');
const { addComment } = require('./newComment');
const { getAllComments } = require('./getComment');

const getComments = (req, res) => getAllComments(req, res, db);
const newComment = (req, res) => addComment(req, res, db);

module.exports = {
    getComments,
    newComment,
};
