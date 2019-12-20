/* eslint-disable arrow-parens */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
const { INTERNAL_SERVER_ERROR, CREATED } = require('http-status-codes');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const createPost = async (req, res, db) => {
	const { thread } = req.body;
	const newPost = {
		commentCount: 0,
		createdAt: new Date().toISOString(),
		likeCount: 0,
		thread,
		userId: req.user.uid,
	};
	await db.collection('posts').add(newPost);
	return res.status(CREATED).json({ data: newPost, status: success });
};

const errorsReturn = (res) => {
	res.status(INTERNAL_SERVER_ERROR).json({
		message: somethingWentWrong,
		status: error,
	});
};
const addPost = async (req, res, db) => {
	// ensure unique data
	try {
		return createPost(req, res, db);
	} catch (err) {
		return errorsReturn(res, err);
	}
};

module.exports = {
	addPost,
};
