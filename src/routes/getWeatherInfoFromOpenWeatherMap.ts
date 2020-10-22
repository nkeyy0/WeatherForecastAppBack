import {Router, Request, Response, NextFunction} from 'express';
import authMiddleware from '../middleware/auth';
import firebase from 'firebase';
import admin from 'firebase-admin';
import fetch from 'node-fetch';

const router = Router();

router.post("/", authMiddleware, async (req:Request, res:Response) => {
  const { email, city } = req.body;
  try {
    const data = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.API_KEY_FROM_OPEN_WEATHER}&units=metric`
    );
    const dataResponse = await data.json();
    if (dataResponse.cod === "404") {
      const error = new Error();
      error.message = "City not found";
      throw error;
    }
    const userUID = await admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        return userRecord.uid;
      })
      .catch((error) => error);
    console.log(userUID);
    if (userUID.code === "auth/user-not-found") {
      const error = new Error();
      error.message = "User not found";
      throw error;
    }
    const ref = firebase.database().ref("users/" + userUID);
    await ref.update({
      city: city,
      api: "OpenWeatherMap",
    });
    res.status(200).json({
      dataResponse,
    });
  } catch (error) {
    console.log(error.message);

    res.status(404).json({
      message: error.message,
    });
  }
});

export default router;
