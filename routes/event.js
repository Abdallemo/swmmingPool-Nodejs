const express = require("express");
const router = express.Router();
const {getSwimmingPool } = require('../configs/db-config');



router.get("/", async (req, res) => {
    try {
      const userData = JSON.parse(req.cookies.userData);
      const userEmail = userData.email;  
      
      const events = await getSwimmingPool(userEmail);
  
      
      const formattedEvents = events.map(event => ({
        title: `Booked: ${event.user_id}`,
        start:Date.parse(event.booking_date) ,
        end: Date.parse(event.booking_date),  
        description: `Number of people: ${event.num_people.toString}`,
        color: "#FF6347",  
      }));
  
      res.json(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });


module.exports = router;
