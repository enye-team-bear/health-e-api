const firebase = require("firebase");
const { validateLoginData } = require("../../util/validator");
const { status, message } = require("../../util/constants");
var HttpStatus = require("http-status-codes");

const loginUser = async (req, res, db ) => {
    const { email, password } = req.body;
    const user = {
      email,
      password
    };
    const { error, success } = status;
    const {
      somethingWentWrong,
      wrongCredentials,
      auth_userNotFound,
      auth_wrongPassword,
    } = message;
    const {
      PRECONDITION_FAILED,
      INTERNAL_SERVER_ERROR,
      BAD_REQUEST,
      OK,
    } = HttpStatus;

    const { errors, valid } = validateLoginData(user);
    if (!valid)
      return res
        .status(PRECONDITION_FAILED)
        .json({ status: error, message: errors });
  
    try {
      const userData = await firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password);
      const Token = await userData.user.getIdToken();
      return res.status(OK).json({ status: success, message: Token });
    } catch (err) {
      if (err.code === auth_userNotFound) {
        return res.status(BAD_REQUEST).json({
          status: error,
          message: wrongCredentials
        });
      } else if (err.code === auth_wrongPassword) {
        return res.status(BAD_REQUEST).json({
          status: error,
          message: wrongCredentials
        });
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json({
          status: error,
          message: somethingWentWrong
        });
      }
    }
  };

  module.exports = {
      loginUser
  }