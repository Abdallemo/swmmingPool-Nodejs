const express = require("express");
const router = express.Router();
const {getSwimmingPool } = require('./db-config');



router.get("/", async (req, res) => {
    try {
      const userData = JSON.parse(req.cookies.userData);
      const userEmail = userData.email;  
      
      const events = await getSwimmingPool(userEmail);
  
      
      const formattedEvents = events.map(event => ({
        title: `Booking: ${event.user_id}`,
        start: event.booking_date,
        end: event.booking_date,  
        description: `Number of people: ${event.num_people}`,
        color: "#FF6347",  
      }));
  
      res.json(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });


module.exports = router;
