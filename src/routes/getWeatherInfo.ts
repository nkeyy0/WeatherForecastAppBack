import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";
import firebase from "firebase";
import { auth, database } from "firebase-admin";
import fetch from "node-fetch";

import { getWeatherInfo } from "../controllers/UserController";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  await getWeatherInfo(req, res, next);
});

export default router;
