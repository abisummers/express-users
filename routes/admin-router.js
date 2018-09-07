const express = require("express");
const router = express.Router();
const User = require("../models/user-model.js");

router.get("/admin/users", (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "Only for admins");
    res.redirect("/login");
    return;
  }

  User.find()
    .sort({ role: 1, createdAt: 1 })
    .then(userResult => {
      res.locals.userArray = userResult;
      res.render("admin-views/user-list.hbs");
    })
    .catch(err => next(err));
});

module.exports = router;
