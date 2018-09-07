const passport = require("passport");
const SlackStrategy = require("passport-slack").Strategy;

const chalk = require("chalk");

const User = require("../../models/user-model.js");

passport.use(
  new SlackStrategy(
    {
      //Settings
      clientID: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
      callbackURL: "/slack/user-info",
      proxy: true //need this for a real website
    },
    (accessToken, refreshToken, userInfo, done) => {
      //function than runs when a user logs in successfully
      console.log(chalk.yellow("SLACK USER INFO"), userInfo);

      const { name, email } = userInfo.user;

      User.findOne({ email })
        .then(userDoc => {
          if (userDoc) {
            //log the user in if they have an account already
            done(null, userDoc);
            return;
          }
          User.create({ fullName: name, email })
            .then(userDoc => {
              done(null, userDoc);
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }
  )
);
