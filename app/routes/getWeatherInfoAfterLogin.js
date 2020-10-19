const { Router } = require("express");
const authMiddleware = require("../../middleware/auth");
const firebase = require("firebase");
const admin = require("firebase-admin");
const fetch = require("node-fetch");


const router = Router();

router.post("/",authMiddleware ,async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const userUID = await admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        return userRecord.uid;
      })
      .catch((error) => error);
    if (userUID.code === "auth/user-not-found") {
      const error = new Error();
      error.message = "User not found";
      throw error;
    }
    console.log(userUID);
    const ref = firebase.database().ref("users/" + userUID);
    const userInfo = await new Promise((resolve, reject) => {
      ref.on(
        "value",
        (snapshot) => {
          console.log(snapshot.val());
          resolve({ city: snapshot.val().city, api: snapshot.val().api });
        },
        (err) => {
          reject(err.code);
        }
      );
    });
    let data = {};
    console.log(userInfo.api);
    if (userInfo.api === "OpenWeatherMap") {
      data = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${userInfo.city}&APPID=${process.env.API_KEY_FROM_OPEN_WEATHER}&units=metric`
      );
    }
    if (userInfo.api === "Weatherstack") {
      data = await fetch(
        `http://api.weatherstack.com/current?access_key=${process.env.API_KEY_FROM_WEATHERSTACK}&query=${userInfo.city}&units=m`
      );
    }
    const dataResponse = await data.json();
    console.log(dataResponse);
    res.set("Content-Type", "application/json");
    res.status(200).json({
      api: userInfo.api,
      dataResponse,
    });
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({
        message: error.message,
      });
    }
  }
});


module.exports = router;
