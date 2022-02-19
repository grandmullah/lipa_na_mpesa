const admin = require("firebase-admin");
require('dotenv').config()

const serviceAccount = require(process.env.FIRE)



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

module.exports ={
    db
}