require('dotenv').config();

module.exports = {
  dataBaseURL: "https://firebasestorage.googleapis.com/v0/b/",
  defaultBucket: process.env.storageBucket,
  resourceBaseURL: `https://firebasestorage.googleapis.com/v0/b/${process.env.storageBucket}/o/<path>?alt=media&token=<token>`
}
