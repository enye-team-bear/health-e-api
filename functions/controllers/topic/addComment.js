/* eslint-disable indent */
/* eslint-disable no-tabs */
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const {
	commentAddSuccessful,
	somethingWentWrong,
	postNotFound,
	mustNotBeEmpty,
} = message;

const verifyComment = async (req, res, db, post, newComment) => {
	if (!post.exists) {
		res.status(BAD_REQUEST).json({ message: postNotFound, status: error });
	}
	post.ref.update({ commentCount: post.data().commentCount + 1 });
	await db.collection('comments').add(newComment);
	return res.status(OK).json({ data: commentAddSuccessful, status: success });
};

const comment = async (req, res, db) => {
	if (req.body.body.trim() === '') {
		return res.status(400).json({ error: mustNotBeEmpty });
	}
	const newComment = {
		body: req.body.body,
		createdAt: new Date().toISOString(),
		topicId: req.params.topicId,
		userImage: req.user.imageUrl,
		userName: req.user.userName,
	};
	const post = await db.doc(`/topics/${req.params.topicId}`).get();
	return verifyComment(req, res, db, post, newComment);
};

const addComments = async (req, res, db) => {
	try {
		return comment(req, res, db);
	} catch (err) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ message: somethingWentWrong, status: error });
	}
};

module.exports = {
	addComments,
};
