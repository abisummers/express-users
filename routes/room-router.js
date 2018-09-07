const express = require("express");
const router = express.Router();
const Room = require("../models/room-model.js");

router.get("/my-rooms", (req, res, next) => {
  //Check to see if you're logged in

  if (!req.user) {
    req.flash("error", "Youre not logged in");
    res.redirect("/login");
    return;
  }
  //find rooms owned by logged in user
  Room.find({ owner: { $eq: req.user._id } })
    .sort({ createdAt: -1 })
    .then(roomResult => {
      res.locals.roomArray = roomResult;
      res.render("room-views/room-list.hbs");
    })
    .catch(err => nex(err));
});

//-------------------adding room to database ---------

router.get("/room/add", (req, res, next) => {
  //Check to see if user is logged in
  if (!req.user) {
    req.flash("error", "Youre not logged in");
    res.redirect("/login");
  } else {
    res.render("room-views/room-form.hbs");
  }
});

router.post("/process-room", (req, res, next) => {
  const { name, description, pictureUrl } = req.body;
  const owner = req.user._id;

  Room.create({ name, description, pictureUrl, owner })
    .then(roomDoc => {
      req.flash("success", "room added successfully");
      res.redirect("/my-rooms");
    })
    .catch(err => next(err));
});

module.exports = router;
