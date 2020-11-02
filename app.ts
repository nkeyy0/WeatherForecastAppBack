import admin, { ServiceAccount } from "firebase-admin";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import firebase from "firebase";
import dotenv from "dotenv";
dotenv.config();
import serviceAccount from "./ServiceAccountKey/serviceAccountKey.json";
import config from "./src/config/app";
import loginRoute from "./src/routes/login";
import logoutRoute from "./src/routes/logout";
import getWeatherInfoAfterLoginRouter from "./src/routes/getWeatherInfoAfterLogin";
import getWeatherInfoRouter from "./src/routes/getWeatherInfo";
import createUserRouter from "./src/routes/createUser";
import {handleError, ErrorHandler} from './src/helpers/error';

const app = express();



app.use((req: Request, res: Response, next: NextFunction) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
  res.append("Access-Control-Expose-Headers", "Authorization");

  next();
});
app.use(express.static("static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const params: ServiceAccount = {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key,
};
console.log(params);
admin.initializeApp({
  credential: admin.credential.cert(params),
  databaseURL: "https://weatherappback.firebaseio.com",
});

console.log(config.configFirebase);
firebase.initializeApp(config.configFirebase);

app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/createUser", createUserRouter);
app.use("/getWeatherInfoAfterLogin", getWeatherInfoAfterLoginRouter);
app.use(
  "/getWeatherInfo",
  getWeatherInfoRouter
);


app.use((err: ErrorHandler ,req:Request, res:Response, next:NextFunction) => {
  const statusCode: number = err.statusCode;
  const message: string = err.message;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message
    })
  next();
});

app.listen(config.PORT, () => {
  console.log(`Server has been started at http://localhost:${config.PORT}`);
});
