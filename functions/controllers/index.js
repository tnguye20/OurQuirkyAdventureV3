const { createUser, authUser, uploadToBucket, postMemoryInfo } =  require('../use-cases');

const { makeSignup } = require('./signup');
const { makeSignin } = require('./signin');
const { makeUploadMemory } = require('./uploadMemory');
const { makeMemoryInfo } = require('./memoryInfo');

const signup = makeSignup({ createUser });
const signin = makeSignin({ authUser });
const uploadMemory = makeUploadMemory({ uploadToBucket });
const memoryInfo = makeMemoryInfo({ postMemoryInfo });

module.exports = Object.freeze({
  signup,
  signin,
  uploadMemory,
  memoryInfo
})
