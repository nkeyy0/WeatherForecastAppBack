import { Router, Request, Response, NextFunction } from "express";
import firebase from "firebase";
import admin from "firebase-admin";
const constants = require("../constants/constants");

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, surname, patronymic, city, email, password } = req.body;
  console.log(name, surname, patronymic, city, email, password);
  try {
    const id = await admin
      .auth()
      .createUser({
        email: email,
        emailVerified: false,
        password: password,
        displayName: `${name} ${surname} ${patronymic}`,
        disabled: false,
      })
      .then((userRecord) => {
        console.log("Successfully created new user:", userRecord.email);
        return userRecord.uid;
      })
      .catch((error) => {
        console.log("Error creating new user:", error.code);
        return error.code;
      });
    console.log(id);
    if (id === "auth/email-already-exists") {
      const error = new Error();
      error.message = "User with this email already exists";
      throw error;
    }
    if (id === "auth/invalid-display-name") {
      const error = new Error();
      error.message = "Invalid name: Name must not be empty";
      throw error;
    }
    if (id === "auth/invalid-email") {
      const error = new Error();
      error.message = "Invalid email";
      throw error;
    }
    if (id === "auth/invalid-password") {
      const error = new Error();
      error.message =
        "Invalid password: password must be more than 6 characters";
      throw error;
    }
    firebase
      .database()
      .ref("users/" + id)
      .set({
        city,
        api: constants.DEFAULT_API,
      });
    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
