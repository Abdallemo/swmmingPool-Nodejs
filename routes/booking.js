var express = require("express");
var router = express.Router();
require('fullcalendar');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("booking");
});
router.post("/", function (req, res, next) {
  
});

module.exports = router;
