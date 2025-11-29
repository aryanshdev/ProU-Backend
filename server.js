const express = require("express");
const dotenv = require("dotenv");
const appRouter = require("./routes/app");
const cors = require("cors");
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
    "origin": "*",
    methods : ["PUT","DELETE", 'POST', 'GET']
}));
const port = process.env.PORT || 3000;

// setup password for google auth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());

// use the auth routes
app.use("/auth", authRouter);
// use the app route after ensuriong authentication
app.use("/app", ensureAuthenticated, appRouter);

// for overcoming render's service spindown
app.get("/keepAlive", (req, res) => {
  res.send("Server is alive");
});

// listen to port
app.listen(port, () => {
  console.log(`Server Up At ${port}`);
});
