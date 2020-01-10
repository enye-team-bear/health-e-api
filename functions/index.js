/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const functions = require('firebase-functions');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');
const { db } = require('./util/admin');

const app = express();

dotenv.config();

const userRoute = require('./routes/index');

app.use(cors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/', userRoute);

exports.api = functions.https.onRequest(app);
module.exports = functions.https.onRequest(app);

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
        db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => console.error(err));
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
