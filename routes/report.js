const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const {
  DisplaySwimmingPool,
  DisplayUsers,
  DisplayPayment,
} = require("./db-config");
const {generateReport}= require('./helpers/helper')


router.get("/", (req, res) => {
  res.render("admin/dashboard");
});
router.post("/", async (req, res) => {
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
