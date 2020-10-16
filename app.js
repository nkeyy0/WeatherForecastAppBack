const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const firebase = require("firebase");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const uuid = require("uuid");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");
// const jwtMiddleware = require('express-jwt');
require("dotenv").config();
const authMiddleware = require("./middleware/auth");

const app = express();
const jsonParser = bodyParser.json({ extended: false });
app.use(
  session({
    secret: "some secret key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
  res.append("Access-Control-Expose-Headers", "Authorization");

  next();
});
app.use(express.static("static"));
app.use(jsonParser);
app.use(cors());
app.use(passport.initialize());
// require('./middleware/passport.js')(passport);
const serviceAccount = require("./ServiceAccountKey/serviceAccountKey.json");
const e = require("express");
const { resolveInclude } = require("ejs");
const { auth } = require("firebase-admin");
const AUTH_USER_NOT_FOUNT = require("./constants/constants")
  .AUTH_USER_NOT_FOUND;
const AUTH_WRONG_PASSWORD = require("./constants/constants")
  .AUTH_WRONG_PASSWORD;
const DEFAULT_API = require("./constants/constants").DEFAULT_API;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://weatherappback.firebaseio.com",
});

const config = {
  apiKey: "AIzaSyDm-Q6ENmEXZRuVapyuIUSIgyIZySrRfKU",
  authDomain: "weatherappback.firebaseapp.com",
  databaseURL: "https://weatherappback.firebaseio.com",
  storageBucket: "weatherappback.appspot.com",
};
firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();

const PORT = 5000;

app.get("/", async (req, res) => {
  const userId = req.query.userId;
  const userInfo = await getUserInfo(userId);

  if (!userInfo) {
    res.send("asf");
  }
  res.status(200);
  res.send(userInfo);
});

app.post("/login", jsonParser, async (req, res) => {
  const { email, password } = req.body;
  const error = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error.code);
      return error.code;
    });
  if (error === AUTH_USER_NOT_FOUNT) {
    res.status(404).json({
      message: "User with this email was not found",
    });
  }
  if (error === AUTH_WRONG_PASSWORD) {
    res.status(401).json({
      message: "Incorrect password. Try it again",
    });
  }
  const userUID = await admin
    .auth()
    .getUserByEmail(email)
    .then(function (userRecord) {
      return userRecord.uid;
    });
  console.log(userUID);
  const ref = database.ref("users/" + userUID);
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
  console.log(userCitySearch);
  const userResult = await admin
    .auth()
    .getUserByEmail(email)
    .then(function (userRecord) {
      return { name: userRecord.displayName, email: userRecord.email };
    })
    .catch(function (error) {
      console.log("Error fetching user data:", error);
      return error;
    });
  console.log(userCitySearch);
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
});

app.post("/logout", jsonParser, async (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("success");
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post(
  "/getWeatherInfoAfterLogin",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    const { email } = req.body;
    console.log(email);
    const userUID = await admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        return userRecord.uid;
      });
    console.log(userUID);
    const ref = database.ref("users/" + userUID);
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
  }
);

app.post("/signInWithGoogle", jsonParser, async (req, res) => {
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
});

app.post(
  "/getWeatherInfoFromOpenWeatherMap",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    const { email, city } = req.body;
    const data = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.API_KEY_FROM_OPEN_WEATHER}&units=metric`
    );
    const userUID = await admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        return userRecord.uid;
      });
    console.log(userUID);
    const ref = database.ref("users/" + userUID);
    await ref.update({
      city: city,
      api: "OpenWeatherMap",
    });
    const dataResponse = await data.json();
    res.status(200).json({
      dataResponse,
    });
  }
);

app.post(
  "/getWeatherInfoFromWeatherstack",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    const { email, city } = req.body;
    const data = await fetch(
      `http://api.weatherstack.com/current?access_key=${process.env.API_KEY_FROM_WEATHERSTACK}&query=${city}&units=m`
    );
    const userUID = await admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        return userRecord.uid;
      });
    console.log(userUID);
    const ref = database.ref("users/" + userUID);
    await ref.update({
      city: city,
      api: "Weatherstack",
    });
    const dataResponse = await data.json();
    res.status(200).json({
      dataResponse,
    });
  }
);

app.post("/createUser", jsonParser, async (req, res) => {
  const { name, surname, patronymic, city, email, password } = req.body;
  console.log(name, surname, patronymic, city, email, password);

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
    res.status(403).json({
      message: "User with this email already exists",
    });
  } else {
    firebase
      .database()
      .ref("users/" + id)
      .set({
        city,
        api: DEFAULT_API,
      });
    res.status(200).json({
      message: "OK",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server has been started at http://localhost:${PORT}`);
});
