import passport from 'passport';
import { Strategy as GoogleStrategy} from 'passport-google-oauth20'

passport.use(new GoogleStrategy({
    clientID: "604240548189-5u16ae139k3jnbrjq88l8d2o4pealdse.apps.googleusercontent.com",
    clientSecret: "ligHBM-BWpDl2aIyLOd6Tme2",
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));