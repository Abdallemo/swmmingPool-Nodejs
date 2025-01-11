const express = require("express");
const {
  DisplaySwimmingPool,
  DisplayUsers,
  countNumberOfColumn,
  DisplayPayment,
  deleteUsersBooking, deleteUser , deleteUsersPayment,DisplayFeedback
} = require("../configs/db-config");
const fs = require("fs");
const path = require("path");
const {generateReport}= require('../helpers/helper')

require("firebase/auth");
const admin = require("firebase-admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const Booking_result = await DisplaySwimmingPool();
  const users_result = await DisplayUsers();
  const user_payment = await DisplayPayment();
  const totalUsers = await countNumberOfColumn("swimmingpool", "users");
  const totalBooking = await countNumberOfColumn("swimmingpool", "booking");
  console.log(totalUsers);
  res.render("admin/adminDashboard", {
    users_data: users_result,
    booking_data: Booking_result,
    total_users: totalUsers,
    total_booking: totalBooking,
    all_Payments:user_payment
  });
});

router.post('/deletebooking',async(req,res)=>{

  const {booking_id} = req.body

  await deleteUsersBooking(booking_id);


  res.redirect('/admin/dashboard');
})


router.post('/deleteuser',async(req,res)=>{
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

router.get('/feedback', async(req, res, next)=> {
  const usersFeedback  = await DisplayFeedback();


  res.render('admin/adminFeedback',{usersFeedback:usersFeedback});
});


router.post("/report", async (req, res) => {
  const booking_table = await DisplaySwimmingPool();
  const user_table = await DisplayUsers();
  const payment_table = await DisplayPayment();
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString();

  const fileContent = generateReport(booking_table,user_table,date,time);
  console.log("clicked generate repor ..");

  const filename = "report.txt";
  const filePath = path.join(__dirname, filename);

  fs.writeFileSync(filePath, fileContent);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.log("Error downloading file: " + filename);
      console.log(err);
    }
    fs.unlinkSync(filePath);
  });
});

module.exports = router;
