const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const app = require('./app');
const api = functions.https.onRequest(app);

module.exports = {
  api
}
