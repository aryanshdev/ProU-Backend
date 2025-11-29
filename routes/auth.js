const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:3000",
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        name: req.user.displayName,
        email: req.user.emails[0].value,
        pfp: req.user.photos[0]["value"],
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res
      .cookie("auth", token)
      .redirect(
        `http://localhost:3000/dashboard?token=${token}`
      );
  }
);

router.get("/whoami", ensureAuthenticated, (req, res) => {
  const token = req.headers["auth"];
  const data = jwt.verify(token, process.env.JWT_SECRET);
  res.json(data);
});

function ensureAuthenticated(req, res, next) {
  const token = req.headers["auth"];
  if (!token) {
    return res.sendStatus(403);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    next();
  });
}

module.exports = { router, ensureAuthenticated };
