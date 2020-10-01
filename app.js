const express = require("express");
const admin = require("firebase-admin");
const firebase = require("firebase");
const session = require("express-session");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const registerParser = bodyParser.json({ extended: false });
app.use(
  session({
    secret: "some secret key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("static"));
app.use(registerParser);
app.use(cors());
const serviceAccount = require("./ServiceAccountKey/serviceAccountKey.json");


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

app.post("/register", registerParser, async (req, res) => {
  const userId = req.body.id;
  const name = req.body.name;
  const surname = req.body.surname;
  const patronymic = req.body.patronymic;
  const email = req.body.email;
  const city = req.body.city;
  const password = req.body.password;
  const hashPassword = await bcrypt.hash(password, 10);
  firebase.database().ref("users/" + userId).set({
  name,
  surname,
  patronymic,
  email,
  city,
  password: hashPassword
  });
  res.header('Content-type', 'application/json')
  if(!req.body) {
    return res.sendStatus(400);
  }
  console.log(req.body);
  // res.send(JSON.stringify(req.body));
});

app.get("/register", (req, res) => {
  if (req.url) {
    res.send(req.url);
  }
});

const writeUserData = (
  userId,
  name,
  surname,
  patronymic,
  city,
  avatar,
  password
) => {
  firebase.database().ref("/users").set({
    users: userId,
  });
};

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
