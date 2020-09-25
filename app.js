const express = require("express");
const admin = require("firebase-admin");
const firebase = require("firebase");

const serviceAccount = require("./serviceAccountKey.json");

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

const writeUserData = (userId, name, surname, patronymic, city, avatar) => {
  firebase.database.ref();
};

const PORT = 5002;

const app = express();

app.use(express.static("static"));

const getUserInfo = async (id) => {
  const userRef = firebase.database().ref("users/" + id);
  const userInfo = await new Promise((resolve, reject) => {
    userRef.on("value", (data) => {
      resolve(data.val());
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

app.get("/", async (req, res) => {
  const userId = req.query.userId;
  const userInfo = await getUserInfo(userId);
  if (!userInfo) {
    res.send("asf");
  }
  res.send(userInfo);
});

app.listen(PORT, () => {
  console.log(`Server has been started at http://localhost:${PORT}`);
});
