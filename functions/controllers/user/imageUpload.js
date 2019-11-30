const Busboy = require('busboy')
const path = require('path')
const os = require('os');
const fs = require('fs')
const config = require('../../util/config')
const { admin } = require('../../util/admin')
const { status, message } = require('../../util/constants');
const HttpStatus = require('http-status-codes');

config.storageBucket

const imageUpload = async (req, res, db) => {
    const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = HttpStatus
    const { error, success } = status
    const { wrongFileSubmitted, somethingWentWrong, imageUpdateSucces } = message

    const busboy = new Busboy({headers: req.headers});
    let imageFileName
    let imageToBeUploaded = {};
    const IMAGE_JPEG = 'image/jpeg'
    const IMAGE_PNG = 'image/png'

    await busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== IMAGE_JPEG && mimetype !== IMAGE_PNG){
          return res.status(BAD_REQUEST).json({status: error, message: wrongFileSubmitted})
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName  = `${Math.round(Math.random()*100000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filePath, mimetype};
        file.pipe(fs.createWriteStream(filePath));
    })
    busboy.on('finish', () => {
        try {
            admin.storage().bucket(config.storageBucket).upload(imageToBeUploaded.filePath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            db.doc(`/users/${req.user.userName}`).update({ imageUrl })
            return res.status(OK).json({status: success, data: imageUpdateSucces})
        } catch (err) {
            console.log(err)
            return res.status(INTERNAL_SERVER_ERROR).json({status: error, message: somethingWentWrong})
        }
    })
    busboy.end(req.rawBody)
}

module.exports = {
    imageUpload
}