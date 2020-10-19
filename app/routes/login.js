const { Router } = require("express");
const firebase = require("firebase");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const constants = require("../../constants/constants");

const router = Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const error = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error.code);
        return error.code;
      });
    if (error === constants.AUTH_USER_NOT_FOUND) {
      const error = new Error();
      error.message = "User with this email was not found";
      throw error;
    }
    if (error === constants.AUTH_WRONG_PASSWORD) {
      const error = new Error();
      error.message = "Incorrect password. Try it again";
      throw error;
    }
    const userResult = await admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        return {
          name: userRecord.displayName,
          email: userRecord.email,
          uid: userRecord.uid,
        };
      })
      .catch((error) => error);
    const ref = firebase.database().ref("users/" + userResult.uid);
    const userCitySearch = await new Promise((resolve, reject) => {
      ref.on(
        "value",
        (snapshot) => {
          console.log(snapshot.val());
          resolve(snapshot.val().city);
        },
        (err) => {
          reject(err.code);
        }
      );
    });
    if (userResult.code === "auth/user-not-found") {
      const error = new Error();
      error.message = "User not found";
      throw error;
    }
    const token = jwt.sign(
      {
        userName: userResult.name,
        userCity: userCitySearch,
        userEmail: userResult.email,
      },
      process.env.jwtSecretKey,
      { expiresIn: 60 * 60 }
    );
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    if (error.message === "User with this email was not found") {
      res.status(404).json({
        message: error.message,
      });
    }
    if (error.message === "Incorrect password. Try it again") {
      res.status(401).json({
        message: error.message,
      });
    }
    if (error.message === "User not found") {
      res.status(404).json({
        message: error.message,
      });
    }
  }
});

module.exports = router;
