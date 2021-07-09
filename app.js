const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport")
const AuthRoute = require("./routes/auth");

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

// //passport.js
// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser(function (user, done) {
//   done(null, user.id)
// });
// passport.deserializedUser(function(id, done){
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("server is running on port 3000")
});

app.use("/api", AuthRoute)


















