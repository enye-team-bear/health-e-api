const admin = require("firebase-admin");
const firebase = require("firebase");
var serviceAccount = require("./health-e-api-firebase-adminsdk-phgu4-85eb5aeb08.json");
require("firebase/firestore");
const config = require("./config");


firebase.initializeApp(config);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://health-e-api.firebaseio.com"
});


const db = firebase.firestore();

module.exports = { admin, db };
