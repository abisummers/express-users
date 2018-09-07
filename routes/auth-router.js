const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");
const passport = require("passport");
const router = express.Router();

//-----------------sign up page --------------------
router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, email, originalPassword } = req.body;

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ fullName, email, encryptedPassword })

    .then(userDoc => {
      req.flash("success", "SUCCESS😎");
      res.redirect("/");
    })
    .catch(err => next(err));
});

//----------------login page ------------------

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  //first check if the email is correct
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      //redirect if the email is not in the database
      if (!userDoc) {
        req.flash("error", "🙅‍♂️incorrect details🙅‍♂️");
        res.redirect("/login");
        return;
      }

      //password check
      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "😤incorrect details🙅‍♂️");
        res.redirect("/login");
        return;
      }
      //save the user ID in the session
      //re.logIn() is a passport method that calls serializeUser() (saves user ID in session)
      req.logIn(userDoc, () => {
        req.flash("success", "🎉you are logged in 🎉");
        res.redirect("/");
      });
    })
    .catch(err => next(err));
});

//----------------------log out --------------

router.get("/logout", (req, res, next) => {
  //req.logOut() is a passport method
  req.logOut();

  req.flash("success", "successfully logged out!");
  res.redirect("/");
});
module.exports = router;

//-------------------SLACK LOG IN ------------------

router.get("/slack/login", passport.authenticate("slack"));

router.get(
  "/slack/user-info",
  passport.authenticate("slack", {
    successRedirect: "/",
    successFlash: "slack log in successful",
    failureRedirect: "/login",
    failureFlash: "slack log in failed"
  })
);

//------------------------GOOGLE SIGN IN -----------

router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/plus.profile.emails.read"
    ]
  })
);

router.get(
  "/google/user-info",
  passport.authenticate("google", {
    successRedirect: "/",
    successFlash: "google login successful",
    failureRedirect: "/login",
    failureFlash: "google login failed"
  })
);
