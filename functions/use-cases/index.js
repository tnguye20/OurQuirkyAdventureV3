const { auth, storage } = require('../admin');
const { dba } = require('../data-access');

const { makeCreateUser } = require('./createUser');

const createUser = makeCreateUser({ dba, auth });

module.exports = Object.freeze({
  createUser
})
