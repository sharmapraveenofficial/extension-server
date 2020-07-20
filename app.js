const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const users = require("./model/userModel");
const cookieSession = require("cookie-session");
const profileRoute = require("./routes/profileRoute");
const passportSetup = require("./config/passport-setup");
const dbUpdate = require("./routes/dbRoute");
const similarWebsite = require("./routes/similarWebsite");
const keys = require("./config/keys");

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

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

//Access-Control-Allow-Origin *
app.use(
  cors({
    origin: "http://localhost:3006", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

//#region Google Strategy
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users.findById(id).then(user => {
    done(null, user);
  });
});

app.use("/test", (req, res, next) => {
  console.log("Inside request");
  res.json("test success");
});
app.use("/login/success", profileRoute);

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/auth/google", loggedIn, (req, res, next) => {
  console.log("Inside /auth/google ");
  res.redirect("/profile");
  next();
});

// app.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.json({
//       success: true,
//       message: "user has successfully authenticated",
//       user: req.user,
//       cookies: req.cookies
//     });
//   }
// });

app.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get("/logout", async (req, res) => {
  await req.logout();
  req.session = null;
  res.clearCookie("express:sess");
  res.clearCookie("express:sess.sig");
  res.redirect("http://localhost:3006");
  // res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("logout");
});

app.post("/", dbUpdate);

app.get(
  "/auth/google/callback",
  //  passport.authenticate("google"), function(
  //   req,
  //   res
  // ) {
  //   // console.log("I am working!");
  //   console.log(req.user.name);
  //   res.redirect("/profile/");
  // }
  passport.authenticate("google", {
    successRedirect: "http://localhost:3006",
    failureRedirect: "/auth/login/failed"
  })
);

app.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

app.get("/similarWebsite", similarWebsite);

const PORT = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
mongoose
  .connect(keys.mongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Database Connected"))
  .catch(error => console.log(error));

app.listen(PORT, () => {
  console.log("Node Backend Server running on port*: " + PORT);
});
