const { auth, storage } = require('../admin');
const { dba } = require('../data-access');
const Jimp = require('jimp');
const { uuid } = require("uuidv4");

const { makeCreateUser } = require('./createUser');
const { makeAuthUser } = require('./authUser');
const { makeUploadToBucket } = require('./uploadToBucket');
const { makePostMemoryInfo } = require('./postMemoryInfo');
const { makeMemory } = require('../models/Memories');

const createUser = makeCreateUser({ dba, auth });
const authUser = makeAuthUser({ auth });
const postMemoryInfo = makePostMemoryInfo({ dba, makeMemory })
const uploadToBucket = makeUploadToBucket({ storage, Jimp, dba, uuid, makeMemory });

module.exports = Object.freeze({
  createUser,
  authUser,
  uploadToBucket,
  postMemoryInfo
})
