const _ = require('lodash');
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { message, status } = require('../../util/constants');

const { error, success } = status;
const { somethingWentWrong } = message;

const mapPosts = async (res, posts) => {
    const post = [];
    posts.forEach(doc => {
        post.push(
            _.pick(doc.data(), [
                'createdAt',
                'thread',
                'title',
                'topicID',
                'userID',
            ]),
        );
    });
    return res.status(OK).json({ data: post, status: success });
};

const getPost = async (res, db) => {
    const posts = await db.collection('posts').get();
    if (!posts) {
        return res
            .status(BAD_REQUEST)
            .json({ message: somethingWentWrong, status: error });
    }
    return mapPosts(res, posts);
};

const getAllPosts = async (req, res, db) => {
    try {
        return getPost(res, db);
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: somethingWentWrong, status: error });
    }
};

module.exports = {
    getAllPosts,
};
