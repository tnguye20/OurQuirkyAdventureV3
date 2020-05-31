const { auth, storage } = require('../admin');
const { dba } = require('../data-access');
const Jimp = require('jimp');
const { uuid } = require("uuidv4");

const { makeCreateUser } = require('./createUser');
const { makeAuthUser } = require('./authUser');
const { makeUploadToBucket } = require('./uploadToBucket');
const { makeMemory } = require('../models/Memories');

const createUser = makeCreateUser({ dba, auth });
const authUser = makeAuthUser({ auth });
const uploadToBucket = makeUploadToBucket({ storage, Jimp, dba, uuid, makeMemory });

module.exports = Object.freeze({
  createUser,
  authUser,
  uploadToBucket
})
