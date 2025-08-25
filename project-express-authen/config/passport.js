const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authService = require("../src/services/auth.service")
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
                        name: profile.displayName,
                        email: email,
                        password: "google_oauth_no_password",
                        numberphone: 0,
                        role: "user",
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