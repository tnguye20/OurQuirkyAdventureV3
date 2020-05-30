const { auth, storage } = require('../admin');
const { dba } = require('../data-access');

const { makeCreateUser } = require('./createUser');
const { makeAuthUser } = require('./authUser');

const createUser = makeCreateUser({ dba, auth });
const authUser = makeAuthUser({ auth });

module.exports = Object.freeze({
  createUser,
  authUser
})
