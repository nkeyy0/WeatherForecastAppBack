import admin, { ServiceAccount } from "firebase-admin";
import bodyParser from "body-parser";
import cors from "cors";
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import firebase from "firebase";
import dotenv from "dotenv";
dotenv.config();
import serviceAccount from "./ServiceAccountKey/serviceAccountKey.json";
import config from "./src/config/app";
import loginRoute from "./src/routes/login";

import getWeatherInfoRouter from "./src/routes/getWeatherInfo";
import createUserRouter from "./src/routes/createUser";
import { ErrorHandler } from "./src/helpers/error";
import {handleError} from './src/middleware/errorHandler';
import corsMiddleware from "./src/middleware/cors";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  corsMiddleware(req, res, next);
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
admin.initializeApp({
  credential: admin.credential.cert(params),
  databaseURL: "https://weatherappback.firebaseio.com",
});

console.log(config.configFirebase);
firebase.initializeApp(config.configFirebase);

app.use("/login", loginRoute);
app.use("/createUser", createUserRouter);
app.use("/getWeatherInfo", getWeatherInfoRouter);

app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res);
    next();
  }
);

app.listen(config.PORT, () => {
  console.log(`Server has been started at http://localhost:${config.PORT}`);
});
