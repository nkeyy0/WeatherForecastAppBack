import {Router, Request, Response, NextFunction} from 'express';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import constants from "../constants/constants";
import config from '../config/app';
import firebase, {FirebaseError} from 'firebase';


const router = Router();

router.post("/", async (req:Request, res:Response) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const error: FirebaseError = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        return error;
      });
      console.log(error);
    if (error.code === constants.AUTH_USER_NOT_FOUND) {
      const errorDB = new Error();
      errorDB.message = "User with this email was not found";
      throw error;
    }
    if (error.code === constants.AUTH_WRONG_PASSWORD) {
      const errorDB = new Error();
      errorDB.message = "Incorrect password. Try it again";
      throw error;
    }
    if(error.code){
      const errorDB = new Error();
      errorDB.message = error.message;
      throw errorDB;
    }
    
    const userResult: {name ? : string | undefined, email? : string | undefined, uid? : string | undefined, code?: string | undefined} = await admin
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
    const ref = admin.database().ref("users/" + userResult.uid);
    const userCitySearch: string | undefined = await new Promise((resolve, reject) => {
      ref.on(
        "value",
        (snapshot) => {
          console.log(snapshot.val());
          resolve(snapshot.val().city);
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
      config.jwtSecretKey,
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
    else {
      res.status(400).json({
        message: error.message
      })
    }
  }
});

export default router;
