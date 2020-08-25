const functions = require('firebase-functions');

const app = require('./app');
const api = functions.https.onRequest(app);

const runTimeOpts = {
  timeoutSeconds: 540,
  memory: '2GB'
}

const { extractImageMeta, removeMemory, removeMemoryFile } = require('./triggers');
const imageMetadata = functions.runWith(runTimeOpts).storage.object().onFinalize( extractImageMeta );
const deleteMemoryFile = functions.storage.object().onDelete( removeMemoryFile );
const deleteMemory = functions.firestore.document('/memories/{id}').onDelete( removeMemory );

module.exports = {
  api,
  imageMetadata,
  deleteMemory,
  deleteMemoryFile
}
