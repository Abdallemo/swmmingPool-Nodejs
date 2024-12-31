const express = require("express");
const router = express.Router();
const {getSwimmingPool ,CreateBookslot} = require('./db-config');
require('fullcalendar');

/* GET home page. */
router.get("/",  function (req, res, next) {
  res.render("booking");
});


router.post("/",async function (req, res, next) {
  console.log('first retirve:\n'+req.body);
  try{
  const {date,time,numPeople,gender}= req.body

  if (!date || !time || !numPeople||!gender) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log('res cookies:\n'+req.cookies); 
    const userData = JSON.parse(req.cookies.userData);

    console.log('usernme is'+userData.email);

  await CreateBookslot(date,time,numPeople,gender,userData.email);

    return res.status(201).json({ message: "Booking created successfully" });

  }catch(error){
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Failed to create booking" });
  }  

});

module.exports = router;
