const express = require("express");
const dotenv = require("dotenv");
const appRouter = require("./routes/app");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { router: authRouter, ensureAuthenticated } = require("./routes/auth");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    credentials:true,
    "origin": "*"
}));
const port = process.env.PORT || 3000;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:10000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/app", ensureAuthenticated, appRouter);

app.listen(port, () => {
  console.log(`Server Up At ${port}`);
});
