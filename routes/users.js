const firebase = require("firebase/compat/app");
require("firebase/auth");
const {getSwimmingPool ,CreateBookslot,saveUsersFromFirebase} = require('../configs/db-config');
const express = require("express");
const { getAuth,signOut } = require("firebase/auth");
const admin = require("firebase-admin");
const { error } = require("console");
const { title } = require("process");
const router = express.Router();

router.get("/login", async function (req, res, next) {
  res.render("/login");
});
router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "iD token is Required" });
    }

    const decodeToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded Token:", decodeToken);

    saveUsersFromFirebase(decodeToken.uid,decodeToken.email,decodeToken.name);
    res.cookie(
      "userData",
      JSON.stringify({
        uid: decodeToken.uid,
        email: decodeToken.email,
        name: decodeToken.name,
        img:decodeToken.picture
      }),
      { httpOnly: true, secure: false }
    );

    const { uid, email, name } = decodeToken;

    res.status(200).json({
      message: "User authenticated",
      uid: decodeToken.uid,
      email: decodeToken.email,
      name: decodeToken.name,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});


router.get('/signout', async(req, res, next)=>{
    
    //im dumb though getAuth was not a function lol but its indead a function so dont forget getAuth()

    await signOut(getAuth());

    res.clearCookie("userData");

    console.log('Logout');

    res.redirect('/');
});


module.exports = router;
