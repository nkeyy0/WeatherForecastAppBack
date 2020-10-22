import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";
import firebase from "firebase";
import admin from "firebase-admin";
import fetch from "node-fetch";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log(email);
  try {
    const userUID: string | undefined = await admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        return userRecord.uid;
      })
      .catch((error) => error.code);
    if (userUID === "auth/user-not-found") {
      const error = new Error();
      error.message = "User not found";
      throw error;
    }
    console.log(userUID);
    const ref = firebase.database().ref("users/" + userUID);
    const userInfo: {
      city: string | undefined;
      api: string | undefined;
    } = await new Promise((resolve, reject) => {
      ref.on("value", (snapshot) => {
        console.log(snapshot.val());
        resolve({ city: snapshot.val().city, api: snapshot.val().api });
      });
    });
    console.log(userInfo.api);
    if (userInfo.api === "OpenWeatherMap") {
      const data = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${userInfo.city}&APPID=${process.env.API_KEY_FROM_OPEN_WEATHER}&units=metric`
      );
      res.set("Content-Type", "application/json");
      const dataFromOpenWeather = await data.json();
      res.status(200).json({
        api: userInfo.api,
        dataFromOpenWeather,
      });
    }
    if (userInfo.api === "Weatherstack") {
      const data = await fetch(
        `http://api.weatherstack.com/current?access_key=${process.env.API_KEY_FROM_WEATHERSTACK}&query=${userInfo.city}&units=m`
      );
      res.set("Content-Type", "application/json");
      const dataFromWeatherstack = await data.json();
      res.status(200).json({
        api: userInfo.api,
        dataFromWeatherstack,
      });
    }
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({
        message: error.message,
      });
    }
  }
});

export default router;
