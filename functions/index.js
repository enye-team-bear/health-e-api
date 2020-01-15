/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const functions = require('firebase-functions');
const swaggerUi = require('swagger-ui-express');
const { OK } = require('http-status-codes');
const algoliasearch = require('algoliasearch');
const swaggerDocs = require('./swagger.json');
const { admin, db } = require('./util/admin');

const app = express();

dotenv.config();

const userRoute = require('./routes/index');

app.use(cors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/', userRoute);

exports.api = functions.https.onRequest(app);

const { ALGOLIA_ID, ALGOLIA_ADMIN_KEY } = process.env;
const ALGOLIA_INDEX_NAME = 'topics';

exports.addTopicsToAlgolia = functions.https.onRequest(async (req, res) => {
    const arr = [];
    const docs = await admin
        .firestore()
        .collection('topics')
        .get();
    docs.forEach(doc => {
        const user = doc.data();
        user.objectID = doc.id;
        arr.push(user);
    });
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    index.saveObjects(arr, (err, content) => {
        res.status(OK).json(content);
    });
});

exports.addUserToAlgolia = functions.https.onRequest(async (req, res) => {
    const arr = [];
    const docs = await admin
        .firestore()
        .collection('users')
        .get();
    docs.forEach(doc => {
        const user = doc.data();
        user.objectID = doc.id;
        arr.push(user);
    });
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex('user');

    index.saveObjects(arr, (err, content) => {
        res.status(OK).json(content);
    });
});

exports.onTopicCreated = functions.firestore
    .document('topics/{topicId}')
    .onCreate((snap, context) => {
        const topic = snap.data();
        topic.objectID = context.params.topicId;
        const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        return index.saveObject(topic);
    });

exports.onUserCreated = functions.firestore
    .document('users/{userId}')
    .onCreate((snap, context) => {
        const user = snap.data();
        user.objectID = context.params.topicId;
        const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        return index.saveObject(user);
    });

const createLikeTopicNotification = async (snapshot, doc) => {
    await db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        read: false,
        recipient: doc.data().userName,
        sender: snapshot.data().userName,
        topicId: doc.id,
        type: 'like',
    });
};

const createLikeNotification = async (snapshot, doc) => {
    await db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString(),
        postId: doc.id,
        read: false,
        recipient: doc.data().userName,
        sender: snapshot.data().userName,
        type: 'like',
    });
};
exports.createNotificationOnLikeTopic = functions.firestore
    .document('likes/{id}')
    .onCreate(snapshot => {
        db.doc(`/topics/${snapshot.data().topicId}`)
            .get()
            .then(doc => {
                if (
                    doc.exists &&
                    doc.data().userName !== snapshot.data().userName
                ) {
                    return createLikeTopicNotification(snapshot, doc);
                }
            });
    });

exports.createNotificationOnLikePost = functions.firestore
    .document('likes/{id}')
    .onCreate(snapshot => {
        db.doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then(doc => {
                if (
                    doc.exists &&
                    doc.data().userName !== snapshot.data().userName
                ) {
                    return createLikeNotification(snapshot, doc);
                }
            });
    });

exports.deleteNotificationOnUnlike = functions.firestore
    .document('likes/{id}')
    .onDelete(snapshot => {
        db.doc(`/notifications/${snapshot.id}`).delete();
    });

exports.createNotificationOnCommentPost = functions.firestore
    .document('comments/{id}')
    .onCreate(snapshot => {
        db.doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then(doc => {
                if (
                    doc.exists &&
                    doc.data().userName !== snapshot.data().userName
                ) {
                    return db.doc(`notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        postId: doc.id,
                        read: false,
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        type: 'comment',
                    });
                }
            });
    });

exports.createNotificationOnCommentTopic = functions.firestore
    .document('comments/{id}')
    .onCreate(snapshot => {
        db.doc(`/topics/${snapshot.data().topicId}`)
            .get()
            .then(doc => {
                if (
                    doc.exists &&
                    doc.data().userName !== snapshot.data().userName
                ) {
                    return db.doc(`notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        read: false,
                        recipient: doc.data().userName,
                        sender: snapshot.data().userName,
                        topicId: doc.id,
                        type: 'comment',
                    });
                }
            });
    });

const createLikeCommentNotification = async (snapshot, doc) => {
    await db.doc(`/notifications/${snapshot.id}`).set({
        commentId: doc.id,
        createdAt: new Date().toISOString(),
        read: false,
        recipient: doc.data().userName,
        sender: snapshot.data().userName,
        type: 'like',
    });
};
exports.createNotificationOnCommentLike = functions.firestore
    .document('likes/{id}')
    .onCreate(snapshot => {
        db.doc(`/comments/${snapshot.data().commentId}`)
            .get()
            .then(doc => {
                if (
                    doc.exists &&
                    doc.data().userName !== snapshot.data().userName
                ) {
                    return createLikeCommentNotification(snapshot, doc);
                }
            });
    });
