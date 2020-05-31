const a = require('firebase-admin');
const serviceKey = require('./serviceKey.json');
const firebase = require('firebase');
require('firebase/storage');
require('dotenv').config();

const admin = a.initializeApp({
  credential: a.credential.cert(serviceKey),
  storageBucket: process.env.storageBucket
});
const firebaseConfig = firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
});

const db = admin.firestore();
const auth = firebase.auth();
const storage = admin.storage().bucket();
// const storage = firebase.storage().ref();

module.exports = {
  a,
  admin,
  db,
  storage,
  auth
}
