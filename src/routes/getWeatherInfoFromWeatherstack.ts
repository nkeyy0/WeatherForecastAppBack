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
      `http://api.weatherstack.com/current?access_key=${process.env.API_KEY_FROM_WEATHERSTACK}&query=${city}&units=m`
    );
    const dataResponse = await data.json();
    if (dataResponse.success === false) {
      const error = new Error();
      error.message = "Error receiving data from server";
      throw error;
    }
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
    await ref.update({
      city: city,
      api: "Weatherstack",
    });

    res.status(200).json({
      dataResponse,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
