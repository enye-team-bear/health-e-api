const { db, admin } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");
firebase.initializeApp(config);

const { validateSignUpData } = require("../util/validator");

exports.signupUser = (req, res) => {
  const newUser = {
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    number: req.body.number,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userstatus: req.body.userstatus
  };

  //validating input
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json(errors);

  //creating custom image name for initial profile picture
  const defaultImg = "defaultImg.png";

  //validating user
  let token, userId;
  //ensuring user does not exist in db.. using unique username
  db.doc(`/users/${newUser.username}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({
            status: "error",
            message: "username already exists pick another"
          });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(Token => {
      token = Token;
      const userDetails = {
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        number: req.body.number,
        userstatus: req.body.userstatus,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultImg}?alt=media`,
        userId,
        createdAt: new Date().toISOString()
      };
      return db.doc(`/users/${newUser.username}`).set(userDetails);
    })
    .then(() => {
      return res.status(201).json({ status: "success", token });
    })
    .catch(err => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is Already in Use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong please try again" });
      }
    });
};
