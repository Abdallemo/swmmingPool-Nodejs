const express = require('express');
const router = express.Router();
const {DisplayFeedback} = require('./db-config')



router.get('/', async(req, res, next)=> {
  const usersFeedback  = await DisplayFeedback();


  res.render('admin/adminFeedback',{usersFeedback:usersFeedback});
});

module.exports = router;
