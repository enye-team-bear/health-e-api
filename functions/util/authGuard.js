const { admin, db } = require('./admin')
const httpStatus = require('http-status-codes')
const { status, message } = require('./constants')

module.exports = async (req, res, next) => {
    const { UNAUTHORIZED } = httpStatus
    const { error, fail } = status
    const { unAuthorized, somethingWentWrong } = message

    let idToken
   try {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        idToken = req.headers.authorization.split("Bearer ")[1];
      } else {
        return res.status(UNAUTHORIZED).json({ status: fail, message:  unAuthorized});
      }
      const decodedToken = await admin.auth().verifyIdToken(idToken)
        req.user = decodedToken;
        const user = await db
          .collection("users")
          .where("userId", "==", decodedToken.uid)
          .limit(1)
          .get();
        req.user.userName = user.docs[0].data().userName
        req.user.imageUrl = user.docs[0].data().imageUrl;
        return next()
   } catch(err) {
    console.error("Error while verifying token", err);
    return res.status(unAuthorized).json({status: error, message: somethingWentWrong});
   }
}