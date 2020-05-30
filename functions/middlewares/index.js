const { admin } =  require('../admin');

const { makeTokenVerify } = require('./tokenVerify');
const { filesUpload } = require('./filesUpload');

exports.tokenVerify = makeTokenVerify({ admin });
exports.filesUpload = filesUpload;
