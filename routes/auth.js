const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/user");

const isBlank = (str) => !str || /^\s*$/.test(str);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", (req, res) => {
  const { name, email, githubUsername, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: "Please enter all fields",
    });
  }

  if (password != password2) {
    errors.push({
      msg: "Passwords do not match",
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: "Password must be at least 6 characters",
    });
  }

  if (errors.length > 0) {
    res.render("user/register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({
      email: email,
    }).then((user) => {
      if (user) {
        errors.push({
          msg: "Email already exists",
        });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        let avatar = !isBlank(githubUsername)
          ? `https://avatars.githubusercontent.com/${githubUsername}?s=200`
          : `https://ui-avatars.com/api/?name=${name
              .replace(/\s\s+/g, " ")
              .split(" ")
              .join("+")}&size=200`;

        const newUser = new User({
          name,
          email,
          githubUsername,
          avatar,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");

  res.redirect("/login");
});

module.exports = router;
