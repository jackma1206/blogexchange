const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

//load user model
require("../models/User");
const User = mongoose.model("users");

//login form
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/posts/index",
    failureRedirect: "/",
    failureFlash: true
  })(req, res, next);
});

//register form
router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({
      text: "Passwords do not match"
    });
  }
  if (req.body.password.length < 4) {
    errors.push({
      text: "Password must be atleast 4 characters"
    });
  }
  if (errors > 0) {
    res.render("/", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      image: req.body.image
    });
  } else {
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          pic: req.body.pic
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            } else {
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.redirect("/signin");
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            }
          });
        });
      }
    });
  }
});

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
