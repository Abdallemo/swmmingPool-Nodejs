const express = require('express')
const { DisplaySwimmingPool, DisplayUsers } = require("./db-config");

const router = express.Router();

router.get('/',async(req,res)=>{
    const Booking_result = await DisplaySwimmingPool();
    const users_result = await DisplayUsers();

    users_result.map((user)=>{
        console.log('name: '+user.name);
        console.log('email: '+user.email);
    })





    res.render('admin/adminDashboard',{users_data:users_result,})
})






module.exports = router;