import { Router, Request, Response, NextFunction } from "express";
import {userController} from '../controllers/UserController'
import firebase from "firebase";
import admin, { FirebaseError } from "firebase-admin";
import {DEFAULT_API} from "../constants/constants";
import{createUserValidationRules ,createUserValidator} from '../middleware/createUserValidationMiddleware'

const router = Router();

router.post("/", createUserValidationRules(), createUserValidator, async (req: Request, res: Response, next: NextFunction) => {

  await userController.createUser(req, res, next);
});

export default router;
