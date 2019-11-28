const { status, message } = require("../util/constants");
const config = require("../util/config");
const firebase = require("firebase");
var HttpStatus = require("http-status-codes");
require("firebase/firestore");
firebase.initializeApp(config);

const db = firebase.firestore();

const { validateSignUpData, validateLoginData } = require("../util/validator");

exports.signupUser = async (req, res) => {
  const {
    fullName,
    userName,
    email,
    number,
    password,
    confirmPassword,
    userStatus
  } = req.body;
  const newUser = {
    fullName,
    userName,
    email,
    number,
    password,
    confirmPassword,
    userStatus
  };
  const { error, success } = status;
  const {
    somethingWentWrong,
    wrongCredentials,
    auth_emailInUse,
    auth_userNotFound,
    auth_wrongPassword,
    emailInUse,
    userNameExists
  } = message;
  const {
    PRECONDITION_FAILED,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    OK,
    CREATED,
    CONFLICT
  } = HttpStatus;

  //validating input
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid)
    return res
      .status(PRECONDITION_FAILED)
      .json({ status: error, message: errors });

  //creating custom image name for initial profile picture
  const defaultImg = "defaultImg.png";
  //ensuring user does not exist in db.. using unique username
  try {
    const docu = await db.doc(`/users/${newUser.userName}`).get();
    if (docu.exists) {
      return res.status(CONFLICT).json({
        status: error,
        message: userNameExists
      });
    } else {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
      const userId = await user.user.uid;
      const token = await user.user.getIdToken();
      const userDetails = {
        fullName,
        userName,
        email,
        number,
        userStatus,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultImg}?alt=media`,
        userId,
        createdAt: new Date().toISOString()
      };
      await db.doc(`/users/${newUser.userName}`).set(userDetails);
      return res.status(CREATED).json({ status: success, message: token });
    }
  } catch (err) {
    if (err.code === message.auth_emailInUse) {
      return res
        .status(BAD_REQUEST)
        .json({ status: error, message: emailInUse });
    } else {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ status: error, message: somethingWentWrong });
    }
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = {
    email,
    password
  };
  const { errors, valid } = validateLoginData(user);
  if (!valid)
    return res
      .status(PRECONDITION_FAILED)
      .json({ status: error, message: errors });

  try {
    const data1 = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
    const Token = await data1.user.getIdToken();
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
