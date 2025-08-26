const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authService = require("../src/services/auth.service")
const roles = require("../src/utils/roles");
require("dotenv").config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                let user = await authService.findByEmail(email);

                if(!user) {
                    user = await authService.create({
                        Name: profile.displayName,
                        Email: email,
                        Password: "google_oauth_no_password",
                        NumberPhone: 0,
                        Role: roles.USER,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(err, null)
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;