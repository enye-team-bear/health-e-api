const { admin } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");
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

  //validating input
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json(errors);

  //creating custom image name for initial profile picture
  const defaultImg = "defaultImg.png";

  //validating user
  let token, userId;
  //ensuring user does not exist in db.. using unique username
  try {
    const docu = await db.doc(`/users/${newUser.userName}`).get()
      if (docu.exists) {
        return res
          .status(400)
          .json({
            status: "error",
            message: "username already exists pick another"
          });
      } else {
        const user = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        userId = await user.user.uid
        const token = await user.user.getIdToken()
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
        return res.status(201).json({ status: "success", token });
      }
  }catch(err) {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ status: "error", message: "Email is Already in Use" });
      } else {
        return res
          .status(500)
          .json({status: "error", message: "Something went wrong please try again" });
      }
  };
};

exports.loginUser = async (req, res) => {
	const { email, password } = req.body;
	const user = {
		email,
		password
	};
	const { errors, valid } = validateLoginData(user);
	if (!valid)
		return res.status(400).json({ status: "error", message: errors });

	try {
		const data1 = await firebase
			.auth()
			.signInWithEmailAndPassword(user.email, user.password);
		const Token = await data1.user.getIdToken();
		return res.status(200).json({ status: "success", Token });
	} catch (err) {
		console.log(err);
		if (err.code === "auth/user-not-found") {
			return res
				.status(200)
				.json({
					status: "error",
					message: "Wrong credentials Try Again"
				});
		} else if (err.code === "auth/wrong-password") {
			return res
				.status(403)
				.json({
					status: "error",
					message: "Wrong credentials Try Again"
				});
		} else {
			return res
				.status(500)
				.json({
					status: "error",
					message: "something went wrong, try again"
				});
		}
	}
};
