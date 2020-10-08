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

  const candidate = await getUserFromDB(email);
  if (!candidate) {
    console.log(candidate, "123");
    res.status(404).json({
      message: "User with this email was not found",
    });
  }
  const candidateInfo = Object.values(candidate)[0];
  const candidatePassword = candidateInfo.password;

  const passwordResult = await bcrypt.compare(password, candidatePassword);
  if (!passwordResult) {
    res.status(401).json({
      message: "Incorrect password. Try it again",
    });
  }
  const userName = candidateInfo.name;
  const userSurname = candidateInfo.surname;
  const userPatronymic = candidateInfo.patronymic;
  const userCity = candidateInfo.city;
  const refreshToken = uuidv4();
  const token = jwt.sign(
    {
      name: userName,
      surname: userSurname,
      patronymic: userPatronymic,
      city: userCity,
    },
    process.env.jwtSecretKey,
    { expiresIn: 60 * 60 }
  );
  
  res.status(200).json({
    token: `Bearer ${token}`
  });
});

// app.get("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const candidate = await getUserFromDB();

//   if (candidate) {
//     const candidatePassword = Object.values(candidate)[0].password;
//     const passwordResult = await bcrypt.compare(
//       "228itasull",
//       candidatePassword
//     );
//   }

//   res.send(candidate);
// });

app.post("/register", jsonParser, async (req, res) => {
  res.header("Content-type", "application/json");
  const { userId, name, surname, patronymic, email, city, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const check = await checkUserEmail(email);
  if (check) {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        name,
        surname,
        patronymic,
        email,
        city,
        password: hashPassword,
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

// const login = async (req, res) => {
//   const user = await getUserInfo(id)
//   const candidate = await User.findOne({email:req.body.email})

//   if(candidate){
//     //Проверка пароля, пользователь существует
//     const passwordResult =await bcrypt.compare(req.body.password, candidate.password)
//     if(passwordResult){
//       //Генерация токена, пароли совпали
//       const token = jwt.sign({
//         name: user.name,
//         surname: user.surname,
//         patronymic: user.patronymic,
//         avatar: user.patronymic
//       }, process.env.jwt, {expiresIn: 60 * 60});

//       res.status(200).json({
//         token
//       })
//     }
//     else {
//       //пароли не совпали
//       res.status(401).json({
//         message: 'Passwords do not match'
//       })
//     }
//   }
//   else {
//     // Пользователя нет, ошибка
//     res.status(404).json({
//       message:'User not found'
//     });
//   }
// }

app.listen(PORT, () => {
  console.log(`Server has been started at http://localhost:${PORT}`);
});
