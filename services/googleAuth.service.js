const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model.js");
const { setUser } = require("./auth.service.js");

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile.emails?.[0]?.value || null;
          let user = await User.findOne({ email });
  
          if (!user) {
            user = await User.create({
                username: profile.displayName,
                email,
                profilePicture: profile.photos?.[0]?.value,
                city: "Hyderabad, Pakistan"
            });
          } 

          const token = setUser(user._id);
          return done(null, { user, token });
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  
module.exports = passport;