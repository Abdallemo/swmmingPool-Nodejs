const express = require("express");
const router = express.Router();
require("firebase/auth");
const {DisplayAdmins} = require('./db-config')

router.get("/", (req, res) => {
  const errormsgcrd = req.cookies.errormsgcrd;
  res.clearCookie('errormsgcrd')

  res.render("admin/adminlogin",{errormsgcrd:errormsgcrd});
});
router.post("/",async(req,res)=>{

  const adminMail = req.body.email;
  const adminPassword =req .body.password;
  const admins = await DisplayAdmins();
  console.log(admins);
  console.log('---------database Data for admin---------')

  const admin = admins.find(admin =>admin.email === adminMail && admin.password===adminPassword);

  console.log('---------database Data for admin---------')
  if(admin){
    console.log('they are same');
    res.redirect('/admin/dashboard')

  }else{
    console.log('they are differnt')
    res.cookie("errormsgcrd", "Invalid credentials", { httpOnly: true });
    res.redirect("/admin");
    // res.status(401).send('Invalid credentials');
  }


})

module.exports = router;
