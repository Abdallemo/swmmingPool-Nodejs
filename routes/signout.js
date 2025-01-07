const express = require('express');
const router = express.Router();
const firebase = require("firebase/compat/app");
require("firebase/auth");
const { getAuth,signOut } = require("firebase/auth");
const admin = require("firebase-admin");
router.get('/', async(req, res, next)=>{
    
    //im dumb though getAuth was not a function lol but its indead a function so dont forget getAuth()

    await signOut(getAuth());

    res.clearCookie("userData");

    console.log('Logout');

    res.redirect('/');
});

module.exports = router;
