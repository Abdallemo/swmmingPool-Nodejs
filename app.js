const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("./routes/configs/firebase-config");
const mysql = require("mysql2");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bookingRouter = require("./routes/booking");
const profileRouter = require("./routes/profile");
const feedbackRouter = require("./routes/feedback");
const reportRouter =require('./routes/report');
const signOuteRouter = require("./routes/signout");
const eventRouter= require('./routes/event')
const cardRouter= require('./routes/card')
const adminRouter= require('./routes/admin')
const deleteUserRoute = require('./routes/deleteusers');
const adminDashboardRouter= require('./routes/dashboard')
const serviceaccount = require("./routes/configs/swimming-pool-uthm-firebase-adminsdk-su8h0-ff42a10331.json");
const admin = require("firebase-admin");
const { console } = require("inspector");
require("dotenv").config();
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
});

const app = express();

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());



app.use((req, res, next) => {
  const userData = req.cookies.userData;
  res.locals.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  res.locals.firebaseApiKey = process.env.API_KEY;
  const bookingSuccessMessage = req.cookies.bookingSuccessMessage;
  const errormsgcrd = req.cookies.errormsgcrd;
  res.locals.bookingSuccessMessage = bookingSuccessMessage || null;

  res.locals.errormsgcrd = errormsgcrd||null;

  if (userData) {
    res.locals.user = JSON.parse(userData);
  } else {
    res.locals.user = null;
  }

  next();
});

app.use("/", indexRouter);
app.use("/login", usersRouter);
app.use("/profile", profileRouter);
app.use("/booking", bookingRouter);
app.use("/signout", signOuteRouter);
app.use("/events", eventRouter);
app.use("/admin", adminRouter);
app.use("/feedback", feedbackRouter);
app.use("/admin/dashboard", adminDashboardRouter);
app.use('/admin/dashboard/delete',deleteUserRoute);
app.use('/admin/dashboard/report',reportRouter);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  // Return JSON error response
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

app.use((req, res, next) => {
  res.status(404).render("404");  
});
console.log("Before starting the server");

app.listen(5000, () => {
  console.log("Listing to Port 5000 hey");
});
