const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const keys = require('./keys');
const users = require('../model/userModel')

passport.use(
    new GoogleStrategy({
            clientID: keys.googleAuth.clientID,
            clientSecret: keys.googleAuth.clientSecret,
            callbackURL: keys.googleAuth.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            //console.log(profile)
            try {
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
            } catch (e) {
                console.log("Something went wrong" + e);
            }
        }
    )
);