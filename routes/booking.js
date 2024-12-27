var express = require("express");
var router = express.Router();
require('fullcalendar');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("booking");
});
router.post("/", function (req, res, next) {
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ message: "Date and time are required." });
  }

  // Save the reservation (example: just console.log for now)
  console.log(`Reservation made for ${date} at ${time}`);

  res.json({ message: "Reservation successful!" });
});

module.exports = router;
