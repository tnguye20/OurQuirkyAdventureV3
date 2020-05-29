const router = require('express').Router();
const { express_callback } = require('./utils/express_callback');
const { signup } = require('./controllers');

router.post("/auth/signup", express_callback(signup));

module.exports = router;
