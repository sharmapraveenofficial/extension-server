const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cors = require("cors");
const mongoose = require("mongoose");
var find = require("mongoose-find-or-create");
const users = require("./model/userModel");
const cookieSession = require("cookie-session");
const profileRoute = require('./routes/profileRoute');
// const html = require('html');
//const passportSetup = require("./config/passport-setup");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["newCookieSessionKey"]
  })
);

app.use(passport.initialize());
app.use(passport.session());

var configAuth = {
  googleAuth: {
    clientID: "995926344319-p5eh5t9qgjh19oclosqiqi2mnmpgobit.apps.googleusercontent.com",
    clientSecret: "GcExVRb7z5yKiEMb1egg4EZ6",
    callbackURL: "http://localhost:3000/auth/google/callback"
  }
};

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "public/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(cors());
//Access-Control-Allow-Origin *

app.options("*", cors());

//#region Google Strategy
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      //console.log(profile)
      users
        .findOne({
          email: profile.emails[0].value
        })
        .then(currentUser => {
          if (currentUser) {
            done(null, currentUser);
            console.log("current user" + currentUser);
          } else {
            new users({
                email: profile.emails[0].value,
                name: profile.displayName
              })
              .save()
              .then(newUser => {
                done(null, newUser);
                console.log("new user" + newUser);
              });
          }
        });
    }
  )
);

app.use('/profile', profileRoute);
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.post("/", (req, res) => {
  console.log("request method :" + req.method);
  console.log(
    "-------------------------------------------------------------------------------"
  );
  console.log(req.body);
  console.log(
    "-------------------------------------------------------------------------------"
  );
  res.render("options", {
    username: req.user.name
  });
});


app.get("/auth/google/callback", passport.authenticate("google"), function (
  req,
  res
) {
  console.log("I am working!");
  console.log(req.user.name);
  res.redirect('/profile/');
});



// app.get("/loginsuccess", function (req, res) {
//   console.log("here I am");
//   res.render("options.html");
// });



const PORT = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://praveen_12:praveens12@cluster0-ruqab.mongodb.net/insights?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("Database Connected"))
  .catch(error => console.log(error));

app.listen(PORT, () => {
  console.log("Node Backend Server running on port*: " + PORT);
});