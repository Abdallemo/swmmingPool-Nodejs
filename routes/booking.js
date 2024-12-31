const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
const { inserPaymentTable, CreateBookslot } = require("./db-config");
const { error } = require("console");
const { emit } = require("process");
require("fullcalendar");

/* GET home page. */
router.get("/", function (req, res, next) {
  const bookingSuccessMessage = req.cookies.bookingSuccessMessage
  res.clearCookie('bookingSuccessMessage')
  res.render("booking",{bookingSuccessMessage});
  
});

router.post("/", async function (req, res, next) {
  console.log("Hey atleast it forwads here ");
  let { timeSlots, gender, numPeople, card_number, expiry, cvv ,role} = req.body;
  let date = timeSlots.split(" on ")[1];
  let slottime = timeSlots.split(" on ")[0];
  const userrData = JSON.parse(req.cookies.userData);
  email = userrData.email;
  numPeople = Number(numPeople);
  let total ;

    switch (role) {
      case 'student':
        total = numPeople * 2
        break;
      case 'staf':
        total =  numPeople *4
      break
      case 'outside':
        total =  numPeople *15
      break
      default:
        total == 0;
        console.log('Total back to '+total);
        break;
    }
    console.log(total)

  // todo Please My future me dont forget to delet this :)
  console.log('----------------------------------------------------------------------')
  
  console.log("email:" + email +" "+ typeof email);
  console.log("date:" + date +" "+ typeof date);
  console.log("slot-time:" + slottime +" "+ typeof slottime);
  console.log("gender:" + gender +" "+ typeof gender);
  console.log("numPeople: " + numPeople +" "+ typeof numPeople);
  console.log("card_number: " + card_number +" "+ typeof card_number);
  console.log("expire date : " + expiry +" "+ typeof expiry);
  console.log("ccv: " + cvv +" "+ typeof cvv);
  
  console.log('----------------------------------------------------------------------')

  if (!timeSlots || !gender || !numPeople || !card_number || !expiry || !cvv) {
    res.status(400).json({ error: "Missing required field" });
  }
  try {

    await CreateBookslot(role,date, slottime, numPeople, gender, email);
    await inserPaymentTable(email, card_number, total, date);
    res.cookie("bookingSuccessMessage",  "Successfully Booked" , { httpOnly: true });
    res.redirect("/booking");

  } catch (error) {
    console.log(error);
    req.session.bookingErrorMessage = "Error cannot Book Now Try later";

    res.redirect("/booking");

  }

});

module.exports = router;
