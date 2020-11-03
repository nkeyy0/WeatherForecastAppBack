import { Router, Request, Response, NextFunction } from "express";
import {createUser} from '../controllers/UserController'
import firebase from "firebase";
import admin, { FirebaseError } from "firebase-admin";
import {DEFAULT_API} from "../constants/constants";


const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  await createUser(req, res, next);
});

export default router;
