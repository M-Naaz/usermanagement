const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport")
const expressSession = require("express-session");
const Auth0Strategy = require("passport-auth0");
const AuthRoute = require("./routes/auth");
require("dotenv").config();
mongoose.connect("mongodb+srv://naaz:naaz@cluster0.2d9o8.mongodb.net/userManagement?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("database connection established"))
  .catch("error", (err) => console.log(err));

const app = express();

app.use(morgan("dev"))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//parse requests of content-type - application/json
app.use(bodyParser.json())
app.use('/uploads', express.static("uploads"))


//session
const session = {
  // secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};
app.use(expressSession(session));

passport.js

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("server is running on port 3000")
});

app.use("/api", AuthRoute)















