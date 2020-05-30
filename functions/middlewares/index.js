const { admin } =  require('../admin');

const { makeTokenVerify } = require('./tokenVerify');

exports.tokenVerify = makeTokenVerify({ admin });

