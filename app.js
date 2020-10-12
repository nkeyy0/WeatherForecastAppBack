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
const { AUTH_USER_NOT_FOUNT, AUTH_WRONG_PASSWORD } = require("./constants/constants")

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
  const error = firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log(user.uid);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
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

  res.sendStatus(200).json({
    message: "OK"
  })
});

app.post("/getWeatherInfoFromOpenWeatherMap", jsonParser, async (req, res) => {
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
});

// app.post("/register", jsonParser, async (req, res) => {
//   res.header("Content-type", "application/json");
//   const { id, name, surname, patronymic, email, city, password } = req.body;
//   const hashPassword = await bcrypt.hash(password, 10);
//   const check = await checkUserEmail(email);
//   if (check) {
//     res.sendStatus(400);
//   } else {
//     res.sendStatus(200);
//     firebase
//       .database()
//       .ref("users/" + id)
//       .set({
//         name,
//         surname,
//         patronymic,
//         email,
//         city,
//         password: hashPassword,
//       });
//   }
// });

app.post("/createUser", jsonParser, async (req, res) => {
  const { name, surname, patronymic, city, email, password } = req.body;
  console.log(name, surname, patronymic, city, email, password);
  // const hashPassword = await bcrypt.hash(password, 10);
  // const check = await checkUserEmail(email);
  // if(check){
  //   res.sendStatus(400);
  // }
  // else {

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

const getUserInfo = async (id) => {
  const userRef = firebase.database().ref("users/" + id);
  const userInfo = await new Promise((resolve, reject) => {
    userRef.on("value", (data) => {
      resolve({
        name: data.val().Name,
        surname: data.val().Surname,
        patronymic: data.val().Patronymic,
        avatar: data.val().avatar,
      });
    });
  });
  console.log(userInfo);
  try {
    const userData = userInfo;
    console.log(userData);
    return userData;
  } catch (err) {
    return err;
  }
};

const checkUserEmail = async (email) => {
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
  if (userID) {
    return true;
  } else {
    return false;
  }
};

const getUserFromDB = async (email) => {
  const ref = firebase.database().ref("users");
  const candidate = await new Promise((resolve, reject) => {
    ref
      .orderByChild("email")
      .equalTo(email)
      .on("value", (data) => {
        console.log(data.val());
        resolve(data.val());
      });
  });
  console.log(candidate);

  return candidate;
};

app.listen(PORT, () => {
  console.log(`Server has been started at http://localhost:${PORT}`);
});
