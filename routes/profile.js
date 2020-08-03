const express = require("express");
const router = express.Router();
const moment = require("moment");
const axios = require("axios");

const { ensureAuthenticated } = require("../config/auth");
const Profile = require("../models/profile");
const Experience = require("../models/experience");
const Education = require("../models/education");
const User = require("../models/user");
const Post = require("../models/post");
const { request } = require("express");
const { route } = require("./posts");

router.get("/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("user", ["name", "avatar"])
      .sort({ date: -1 });
    res.render("profiles", {
      profiles,
    });
  } catch (err) {
    console.error(err);
    res.render("error");
  }
});

router.get("/profile/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar", "githubUsername"]);

    const username = profile.user.githubUsername;

    const uri = `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`;
    const response = await axios.get(uri);

    const experience = await Experience.find({
      user: req.params.user_id,
    }).populate("user");

    const education = await Education.find({
      user: req.params.user_id,
    }).populate("user");

    if (!profile) console.log("Profile not found");

    res.render("profile", {
      profile,
      experience,
      education,
      moment: moment,
      repos: response.data,
    });
  } catch (err) {
    console.error(err);
    res.render("error");
  }
});

router.get("/create-profile", ensureAuthenticated, (req, res) => {
  res.render("createProfile");
});

router.post("/create-profile", async (req, res) => {
  try {
    var profile = new Profile({
      user: req.user.id,
      company: req.body.company,
      website: req.body.website,
      location: req.body.location,
      bio: req.body.bio,
      status: req.body.status,
      githubUsername: req.body.githubUsername,
      skills: req.body.skills.split(","),
      youtube: req.body.youtube,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      instagram: req.body.instagram,
      linkedin: req.body.linkedin,
      reddit: req.body.reddit,
    });
    await profile.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error");
  }
});

router.get("/add-experience", ensureAuthenticated, (req, res) => {
  res.render("addExperience");
});

router.post("/add-experience", async (req, res) => {
  try {
    var experience = new Experience({
      user: req.user.id,
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    });
    await experience.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error");
  }
});

router.get("/add-education", ensureAuthenticated, (req, res) => {
  res.render("addEducation");
});

router.post("/add-education", async (req, res) => {
  try {
    var education = new Education({
      user: req.user.id,
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    });
    await education.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error");
  }
});

router.get("/delete-account", ensureAuthenticated, async (req, res) => {
  try {
    // Remove posts
    await Post.deleteMany({ user: req.user.id });

    await Education.deleteMany({ user: req.user.id });

    await Experience.deleteMany({ user: req.user.id });

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.redirect("/register");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
