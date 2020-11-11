import admin, { ServiceAccount } from "firebase-admin";
import bodyParser from "body-parser";
// import  queryParser  from 'express-query-parser';
import cors from "cors";
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import mongoose, { connect } from "mongoose";
import firebase from "firebase";
import dotenv from "dotenv";
dotenv.config();
import serviceAccount from "./ServiceAccountKey/serviceAccountKey.json";
import config from "./src/config/app";
import loginRoute from "./src/routes/login";
import getWeatherInfoRouter from "./src/routes/getWeatherInfo";
import createUserRouter from "./src/routes/createUser";
import getCitiesRouter from "./src/routes/getCities";
import getWeatherForOneCityRouter from "./src/routes/getWeatherForOneCity";
import deleteUserCityRouter from './src/routes/deleteCity';
import { ErrorHandler } from "./src/helpers/error";
import { handleError } from "./src/middleware/errorHandler";
import corsMiddleware from "./src/middleware/cors";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  corsMiddleware(req, res, next);
});
app.use(express.static("static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(queryParser({
//   parseNull: true,
//   parseBoolean: true
// }))
app.use(cors());

const params: ServiceAccount = {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key,
};
admin.initializeApp({
  credential: admin.credential.cert(params),
  databaseURL: "https://weatherappback.firebaseio.com",
});

console.log(config.configFirebase);
firebase.initializeApp(config.configFirebase);

app.use("/login", loginRoute);
app.use("/createUser", createUserRouter);
app.use("/getWeatherInfo", getWeatherInfoRouter);
app.use("/getCities", getCitiesRouter);
app.use("/getWeatherForOnceCity", getWeatherForOneCityRouter);
app.use("/deleteUserCity", deleteUserCityRouter);

app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
    next();
  }
);
app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.locals.error = err;
    const status = err.statusCode || 500;
    res.status(status).json({
      message: err.message,
    });
  }
);

async function start() {
  try {
    const url: string = `mongodb+srv://nkeyy0:${config.passwordMongo}@cluster0.ekj6m.mongodb.net/WeatherInfo?retryWrites=true&w=majority`;

    await connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
    app.listen(config.PORT, () => {
      console.log(`Server has been started at http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
}

start();
