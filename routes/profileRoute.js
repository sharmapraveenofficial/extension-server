const router = require("express").Router();
const bookmarks = require("../model/userBookmark");

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/google");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res, next) => {
  try {
    bookmarks
      .findOne({
        email: req.user.email
      })
      .then(currentUser => {
        let entries = [];
        if (currentUser !== null) {
          let obj = JSON.parse(currentUser.data);
          // console.log(obj)
          Object.entries(obj).forEach(entry => {
            if (entry[1].liked == true) {
              if (entry[1].hashtag == "") {
                entry[1].hashtag = "#Bookmark";
              }

              let str = entry[0].split(".");
              if (str[0] !== "www") {
                entry[1].similarWebsite = "www." + entry[0];
              } else {
                entry[1].similarWebsite = entry[0];
              }
              let time_ = entry[1].trackedSeconds;
              let timer = secondsToHms(time_);

              function secondsToHms(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor((d % 3600) / 60);
                var s = Math.floor((d % 3600) % 60);
                var hDisplay =
                  h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay =
                  m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay =
                  s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                return hDisplay + mDisplay + sDisplay;
              }
              entry[1].trackedSeconds = timer;
              entries.push(entry[1]);
            }
          });
          res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            data: entries
          });
        } else {
          res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            data: entries
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
