const router = require('express').Router();
const { express_callback } = require('./utils/express_callback');
const { signup, signin } = require('./controllers');

router.post("/auth/signup", express_callback(signup));
router.post("/auth/signin", express_callback(signin));

module.exports = router;
