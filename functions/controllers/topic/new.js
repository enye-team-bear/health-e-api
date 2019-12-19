/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable max-len */
// const firebase = require('firebase');
const HttpStatus = require('http-status-codes');
// const { validateCode } = require('../../util/validator');
const { status, message } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong, topicExists } = message;
const { INTERNAL_SERVER_ERROR, CREATED, CONFLICT } = HttpStatus;

const createTopic = async (req, res, db) => {
	const { topic } = req.body;
	await db.doc(`/topics/${topic}`).set({
		createdAt: new Date().toISOString(),
		topic,
	});
	return res.status(CREATED).json({ data: topic, status: success });
};

const errorsReturn = (res) => {
	res.status(INTERNAL_SERVER_ERROR).json({
		message: somethingWentWrong,
		status: error,
	});
};
const addTopic = async (req, res, db) => {
	// ensure unique data
	try {
		const docu = await db.doc(`/topics/${req.body.topic}`).get();
		if (docu.exists) {
			return res.status(CONFLICT).json({
				message: topicExists,
				status: error,
			});
		}
		return createTopic(req, res, db);
	} catch (err) {
		return errorsReturn(res, err);
	}
};

module.exports = {
	addTopic,
};
