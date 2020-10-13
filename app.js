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
const authMiddleware = require('./middleware/auth');

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

// app.post("/login", jsonParser, async (req, res) => {
//   const { email, password } = req.body;

//   const candidate = await getUserFromDB(email);
//   if (!candidate) {
//     console.log(candidate, "123");
//     res.status(404).json({
//       message: "User with this email was not found",
//     });
//   }
//   const candidateInfo = Object.values(candidate)[0];
//   const candidatePassword = candidateInfo.password;

//   const passwordResult = await bcrypt.compare(password, candidatePassword);
//   if (!passwordResult) {
//     res.status(401).json({
//       message: "Incorrect password. Try it again",
//     });
//   }
//   const userName = candidateInfo.name;
//   const userSurname = candidateInfo.surname;
//   const userPatronymic = candidateInfo.patronymic;
//   const userCity = candidateInfo.city;
//   const userEmail = candidateInfo.email;
//   const refreshToken = uuidv4();
//   const token = jwt.sign(
//     {
//       name: userName,
//       surname: userSurname,
//       patronymic: userPatronymic,
//       city: userCity,
//       email: userEmail,
//     },
//     process.env.jwtSecretKey,
//     { expiresIn: 30 }
//   );

//   res.status(200).json({
//     token: `Bearer ${token}`,
//   });
// });

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
  // res.status(200).json({
  //   message: "OK",
  // });
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
  "/getWeatherInfoFromOpenWeatherMap",
  authMiddleware,
  jsonParser,
  async (req, res) => {
    console.log(req.body);
    const { email, city } = req.body;
    console.log(email, city);
    const ref = firebase.database().ref("users");
    const userID = await new Promise((resolve, reject) => {
      ref
        .orderByChild("email")
        .equalTo(email)
        .on("value", (data) => {
          console.log(data.val());
          resolve(data.val());
        });
    });
    console.log(userID);
    const id = Object.keys(userID)[0];

    let lastCitySearch = null;

    if (city === null) {
      lastCitySearch = await new Promise((resolve, reject) => {
        firebase
          .database()
          .ref("users/" + id)
          .on("value", (data) => {
            resolve({
              city: data.val().city,
            });
          });
      });
    } else {
      await firebase
        .database()
        .ref("users/" + id)
        .update({
          city: city,
        });
      lastCitySearch = await new Promise((resolve, reject) => {
        firebase
          .database()
          .ref("users/" + id)
          .on("value", (data) => {
            resolve({
              city: data.val().city,
            });
          });
      });
    }
    const data = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${lastCitySearch.city}&APPID=${process.env.API_KEY_FROM_OPEN_WEATHER}&units=metric`
    );
    const dataResponse = await data.json();
    console.log(dataResponse);
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
      console.log("Error creating new user:", error);
      return null;
    });
  console.log(id);
  if (id) {
    firebase
      .database()
      .ref("users/" + id)
      .set({
        city,
      });
    res.sendStatus(200).json({
      message: "OK",
    });
  } else {
    res.sendStatus(409).json({
      message: "error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server has been started at http://localhost:${PORT}`);
});
