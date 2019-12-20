/* eslint-disable arrow-parens */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
// const firebase = require('firebase');
const HttpStatus = require('http-status-codes');
// const { validateCode } = require('../../util/validator');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong, topicExists } = message;
const { INTERNAL_SERVER_ERROR, CREATED, CONFLICT } = HttpStatus;

const createTopic = async (req, res, db) => {
	const { topic, thread, title } = req.body;
	const newTopic = {
		commentCount: 0,
		createdAt: new Date().toISOString(),
		likeCount: 0,
		thread,
		title,
		topic,
		userId: req.user.uid,
	};
	await db.collection('topics').add(newTopic);
	return res.status(CREATED).json({ data: newTopic, status: success });
};

const errorsReturn = (res) => {
	res.status(INTERNAL_SERVER_ERROR).json({
		message: somethingWentWrong,
		status: error,
	});
};

const check = (req, res, db, docu, topic) => {
	if (docu.docs[0]) {
		const file = docu.docs[0].data().topic;
		if (file === topic) {
			return res.status(CONFLICT).json({
				message: topicExists,
				status: error,
			});
		}
	}
	return createTopic(req, res, db);
};

const addTopic = async (req, res, db) => {
	const { topic } = req.body;
	// ensure unique data
	try {
		const docu = await db
			.collection('topics')
			.where('topic', '==', topic)
			.get();
		return check(req, res, db, docu, topic);
	} catch (err) {
		return errorsReturn(res, err);
	}
};

module.exports = {
	addTopic,
};
