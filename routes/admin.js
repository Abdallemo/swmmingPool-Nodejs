const express = require("express");
require("firebase/auth");
const router = express.Router();

router.get("/", (req, res) => {

  res.render("admin/adminlogin");
});
router.get("/",(req,res)=>{

  console.log(req.body);

  res.redirect('/admin/dashboard')
})

module.exports = router;
