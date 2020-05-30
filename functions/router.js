const router = require('express').Router();

const { express_callback } = require('./utils/express_callback');
const { tokenVerify, filesUpload } = require('./middlewares/');
const { signup, signin, uploadMemory } = require('./controllers');

router.post("/auth/signup", express_callback(signup));
router.post("/auth/signin", express_callback(signin));
router.post("/memory/upload", tokenVerify, filesUpload, express_callback(uploadMemory));

module.exports = router;
