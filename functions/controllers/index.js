const { createUser, authUser, uploadToBucket } =  require('../use-cases');

const { makeSignup } = require('./signup');
const { makeSignin } = require('./signin');
const { makeUploadMemory } = require('./uploadMemory');

const signup = makeSignup({ createUser });
const signin = makeSignin({ authUser });
const uploadMemory = makeUploadMemory({ uploadToBucket });

module.exports = Object.freeze({
  signup,
  signin,
  uploadMemory
})
