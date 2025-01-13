const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("./configs/firebase-config");
const mysql = require("mysql2");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bookingRouter = require("./routes/booking");
const feedbackRouter = require("./routes/feedback");
const eventRouter= require('./routes/event')
const adminRouter= require('./routes/admin')
const adminDashboardRouter= require('./routes/dashboard')
const serviceaccount = require("./configs/swimming-pool-uthm-firebase-adminsdk-su8h0-ff42a10331.json");
const admin = require("firebase-admin");
const { console } = require("inspector");
require("dotenv").config();
const cors = require('cors');
const session = require('express-session');

admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
});

const app = express();

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(session({
  secret: '3d2dj23d', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
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
app.use("/", usersRouter);
app.use("/booking", bookingRouter);
app.use("/events", eventRouter);
app.use("/admin", adminRouter);
app.use("/feedback", feedbackRouter);
app.use("/admin/dashboard", adminDashboardRouter);

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

app.listen(4000, () => {
  console.log("Listing to Port 5000 hey");
});
