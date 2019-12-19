/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable max-len */
const { INTERNAL_SERVER_ERROR, CREATED } = require('http-status-codes');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const createPost = async (req, res, db) => {
	const { title, thread } = req.body;
	await db.doc(`/posts/${title}`).set({
		createdAt: new Date().toISOString(),
		thread,
		title,
		topicID: req.params.id,
		userID: req.user.userName,
	});
	return res.status(CREATED).json({ data: req.body, status: success });
};

const errorsReturn = (res) =>
	res
		.status(INTERNAL_SERVER_ERROR)
		.json({ message: somethingWentWrong, status: error });

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
