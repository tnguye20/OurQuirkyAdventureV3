const { createUser } =  require('../use-cases');

const { makeSignup } = require('./signup');

const signup = makeSignup({ createUser });

module.exports = Object.freeze({
  signup
})
