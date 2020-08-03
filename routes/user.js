const express = require("express");
const router = express.Router();
const moment = require("moment");

const { ensureAuthenticated } = require("../config/auth");
const Profile = require("../models/profile");
const User = require("../models/user");
const Experience = require("../models/experience");
const Education = require("../models/education");

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.find({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    const experience = await Experience.find({ user: req.user.id }).populate(
      "user"
    );

    const education = await Education.find({ user: req.user.id }).populate(
      "user"
    );

    res.render("dashboard", {
      profile,
      experience,
      education,
      user: req.user,
      moment: moment,
    });
  } catch (err) {
    console.error(err.message);
    res.render("error");
  }
});

router.get("/delete-experience/:id", (req, res) => {
  var id = req.params.id;
  Experience.findByIdAndDelete(id, (err, experience) => {
    if (err) console.log(err);
    else {
      res.redirect("/dashboard");
    }
  });
});

router.get("/delete-education/:id", (req, res) => {
  var id = req.params.id;

  Education.findByIdAndDelete(id, (err, education) => {
    if (err) console.log(err);
    else {
      res.redirect("/dashboard");
    }
  });
});

module.exports = router;
