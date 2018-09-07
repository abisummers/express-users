const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const chalk = require("chalk");
const User = require("../../models/user-model.js");

passport.use(
  new GoogleStrategy(
    {
      //settings
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/google/user-info",
      proxy: true
    },
    (accessToken, refreshToken, userInfo, done) => {
      //console.log(chalk.yellow("GOOGLE USER INFO"), userInfo);
      const { displayName, emails } = userInfo;

      User.findOne({ email: { $eq: emails[0].value } })
        .then(userDoc => {
          if (userDoc) {
            done(null, userDoc);
            return;
          }

          User.create({ fullName: displayName, email: emails[0].value })
            .then(userDoc => {
              done(null, userDoc);
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }
  )
);
