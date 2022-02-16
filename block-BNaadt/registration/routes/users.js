var express = require("express");
var router = express.Router();
var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  //console.log(req.session);
  res.render("users");
});

router.get("/register", function (req, res, next) {
  res.render("register", { error: req.flash("error")[0] });
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        req.flash("error", "Add a unique email!");
        return res.redirect("/users/register");
      }
      if (err.name === "ValidatorError") {
        req.flash("error", "err.message");
        return res.redirect("/users/register");
      }
      return res.json({ err });
    }
    res.redirect("/users/login");
  });
});

router.get("/login", function (req, res, next) {
  var error = req.flash("error")[0];
  //console.log(error);
  res.render("login", { error });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/Password required!");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Email is not registered");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "Invalid password!");
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      res.redirect("/users");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});

module.exports = router;
