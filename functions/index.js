const functions = require('firebase-functions');

const app = require('./app');
const api = functions.https.onRequest(app);

// const deleteImage = functions.storage.object().onDelete( async (object, context) => {

// })
const { extractImageMeta, removeMemory, removeMemoryFile } = require('./triggers');
const imageMetadata = functions.storage.object().onFinalize( extractImageMeta );
const  deleteMemoryFile = functions.storage.object().onDelete( removeMemoryFile );
const deleteMemory = functions.firestore.document('/memories/{id}').onDelete( removeMemory );

module.exports = {
  api,
  imageMetadata,
  deleteMemory,
  deleteMemoryFile
}
