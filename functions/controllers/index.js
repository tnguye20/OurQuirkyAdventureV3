const { createUser, authUser } =  require('../use-cases');

const { makeSignup } = require('./signup');
const { makeSignin } = require('./signin');

const signup = makeSignup({ createUser });
const signin = makeSignin({ authUser });

module.exports = Object.freeze({
  signup,
  signin
})
