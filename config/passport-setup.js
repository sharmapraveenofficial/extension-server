// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
// const keys = require('./keys');
// const mongoose = require('mongoose');
// var find = require('mongoose-find-or-create');
// const users = require('../model/userModel')

passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
        //console.log(profile)
        users.findOne({
            email: profile.emails[0].value
        }).then((currentUser) => {
            if (currentUser) {
                done(null, profile);
                console.log("current user" + currentUser)
            } else {
                new users({
                    email: profile.emails[0].value,
                    name: profile.displayName,
                }).save().then((newUser) => {
                    done(null, profile);
                    console.log("new user" + newUser)
                })
            }
        })
    }
));