const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const firebase = require("firebase");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const session = require("express-session");
const uuid = require("uuid");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const authMiddleware = require("./middleware/auth");
const config = require("./config/app");
const loginRoute = require("./app/routes/login");
const logoutRoute = require("./app/routes/logout");
const getWeatherInfoAfterLoginRouter = require("./app/routes/getWeatherInfoAfterLogin");
const getWeatherInfoFromOpenWeatherMapRouter = require("./app/routes/getWeatherInfoFromOpenWeatherMap");
const getWeatherInfoFromWeatherstackRouter = require("./app/routes/getWeatherInfoFromWeatherstack");
const signInWithGoogleRouter = require('./app/routes/signInWithGoogle');
const createUserRouter = require('./app/routes/createUser');


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
const serviceAccount = require("./ServiceAccountKey/serviceAccountKey.json");
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

firebase.initializeApp(config.configFirebase);

// Get a reference to the database service
const database = firebase.database();

app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/signInWithGoogle", signInWithGoogleRouter);
app.use("/createUser", createUserRouter);
app.use("/getWeatherInfoAfterLogin", getWeatherInfoAfterLoginRouter);
app.use("/getWeatherInfoFromWeatherstack", getWeatherInfoFromWeatherstackRouter);
app.use("/getWeatherInfoFromOpenWeatherMap", getWeatherInfoFromOpenWeatherMapRouter);





app.listen(config.PORT, () => {
  console.log(`Server has been started at http://localhost:${config.PORT}`);
});
