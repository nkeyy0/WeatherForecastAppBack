const passport = require("passport");
const admin = require("firebase-admin");
const firebase = require("firebase");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const ref = firebase.database().ref("users");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.jwtSecretKey,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      const userID = await new Promise((resolve, reject) => {
        ref
          .orderByChild("email")
          .equalTo(payload.email)
          .on("value", (data) => {
            console.log(data.val());
            resolve(data.val());
          });
      });
      const UserInfo = Object.values(userID)[0];

      try {
        const user = {
          name: UserInfo.name,
          surname: UserInfo.surname,
          patronymic: UserInfo.patronymic,
          city: UserInfo.city,
        };
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
          console.log(error);
      }
    })
  );
};
