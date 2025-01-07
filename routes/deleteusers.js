const express = require("express");
require("firebase/auth");
const { deleteUser , deleteUsersBooking,deleteUsersPayment} = require("./db-config");
const admin = require("firebase-admin");
const router = express.Router();


router.get('/',(req,res)=>{
    res.redirect('admin/dashboard')
});

router.post('/',async(req,res)=>{
    const {uid,name,email}= req.body;
    console.log('clicked delete button for user with uid of :'+uid+'and a email of :'+email);
    console.log(req.body);
    
    try {
        
        await admin.auth().deleteUser(uid)
        await deleteUser(uid);
        await deleteUsersBooking(email);
        await deleteUsersPayment(email);
        res.clearCookie("userData");
        console.log('succeeded to delete user with this id');
        
    } catch (error) {
        console.error('sorry this '+error +'happened')
        
    }

    res.redirect('/admin/dashboard')
});

module.exports = router;