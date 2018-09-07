const express = require("express");
const router = express.Router();
const User = require("../models/user-model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  //req.user comes from passport deserilazeUSer
  //doc of currently logged in user
  if (req.user) {
    console.log("logged in 😎🎉 ");
  } else {
    console.log("logged out 😢");
  }
  res.render("index.hbs");
});

//you have to be logged in to see the users settings page
router.get("/settings", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "you have to be logged in");
    res.redirect("/login");
  } else {
    res.render("settings-page.hbs");
  }
});

router.post("/process-settings", (req, res, next) => {
  //res.send(req.body);
  const { fullName, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email } },
    { runValidators: true }
  )
    .then(userDoc => {
      req.flash("success", "settings saved!!");
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
