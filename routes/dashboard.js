const express = require("express");
const {
  DisplaySwimmingPool,
  DisplayUsers,
  countNumberOfColumn,
} = require("./db-config");

const router = express.Router();

router.get("/", async (req, res) => {
  const Booking_result = await DisplaySwimmingPool();
  const users_result = await DisplayUsers();
  const totalUsers = await countNumberOfColumn("swimmingpool", "users");
  const totalBooking = await countNumberOfColumn("swimmingpool", "booking");
  console.log(totalUsers);



  res.render("admin/adminDashboard", {
    users_data: users_result,
    booking_data: Booking_result,
    total_users: totalUsers,
    total_booking: totalBooking,
  });
});

module.exports = router;
