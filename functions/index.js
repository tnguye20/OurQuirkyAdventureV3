const functions = require('firebase-functions');

const app = require('./app');
const api = functions.https.onRequest(app);

// const deleteImage = functions.storage.object().onDelete( async (object, context) => {

// })
const { extractImageMeta } = require('./triggers');
const imageMetadata = functions.storage.object().onFinalize( extractImageMeta );

module.exports = {
  api,
  imageMetadata
}
