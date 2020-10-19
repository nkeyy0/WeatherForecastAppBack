const { Router } = require("express");

const router = Router();

router.post("/", async (req, res) => {
  const { id_token } = req.body;
  console.log(id_token);
  const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
  console.log(credential);

  await firebase
    .auth()
    .signInWithCredential(credential)
    .catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  res.status(200).json({
    message: "OK",
  });

  const { Router } = require("express");
  const firebase = require("firebase");
  const admin = require("firebase-admin");
  const jwt = require("jsonwebtoken");
  const constants = require("../../constants/constants");
});

module.exports = router;
