const router = require('express').Router();

router.get("/getName", (req, res) => {
  res.status(200).json({name: "Thang"});
});

module.exports = router;
