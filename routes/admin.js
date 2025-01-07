const express = require("express");
require("firebase/auth");
const router = express.Router();

router.get("/", async (req, res) => {


  res.render("admin/adminlogin");
});

module.exports = router;
