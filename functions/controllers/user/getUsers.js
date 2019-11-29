const { status, message } = require("../../util/constants");
var HttpStatus = require("http-status-codes");

const getAllUser = async (req, res, db) => {
    const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = HttpStatus
    const { error, success } = status
    const { somethingWentWrong,  } = message

    try {
        let user = []
        const users = await db.collection('users').get()
        if(!users) return res.status(BAD_REQUEST).json({ status: "error", message: somethingWentWrong})
        users.forEach(doc => {
            const {createdAt, email, fullName, imageUrl, number, userId, userName, userStatus} = doc.data()
            user.push({
                createdAt,
                email,
                fullName,
                imageUrl,
                number,
                userId,
                userName,
                userStatus
            })
        })
        return res.status(OK).json({status: success, data: user})
    } catch (err) {
        console.log(err)
        return res.status(INTERNAL_SERVER_ERROR).json({status: error, message: somethingWentWrong})
    }
}

module.exports = {
    getAllUser
}