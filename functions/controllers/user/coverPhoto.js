/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { admin } = require('../../util/admin');
const { configConstants, status, message } = require('../../util/constants');

const { error, success } = status;
const { wrongFileSubmitted, somethingWentWrong, imageUpdateSucces } = message;
const { IMAGE_JPEG, IMAGE_PNG } = configConstants;

const coverPhotoUpload = async (req, res, db) => {
    const busboy = new Busboy({ headers: req.headers });
    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== IMAGE_JPEG && mimetype !== IMAGE_PNG) {
            return res
                .status(BAD_REQUEST)
                .json({ message: wrongFileSubmitted, status: error });
        }
        const imageExtension = filename.split('.')[
            filename.split('.').length - 1
        ];
        imageFileName = `${Math.round(
            Math.random() * 100000000,
        )}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype };
        return file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on('finish', () => {
        try {
            admin
                .storage()
                .bucket(process.env.STORAGE_BUCKET)
                .upload(imageToBeUploaded.filePath, {
                    metadata: {
                        metadata: {
                            contentType: imageToBeUploaded.mimetype,
                        },
                        resumable: false,
                    },
                });
            const coverPhoto = `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE_BUCKET}/o/${imageFileName}?alt=media`;
            db.doc(`/users/${req.user.userName}`).set(
                { coverPhoto },
                { merge: true },
            );
            return res
                .status(OK)
                .json({ message: imageUpdateSucces, status: success });
        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .json({ message: somethingWentWrong, status: error });
        }
    });
    busboy.end(req.rawBody);
};

module.exports = {
    coverPhotoUpload,
};
