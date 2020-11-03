import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";
import {auth, database} from "firebase-admin";
import fetch from "node-fetch";
import { getUserWeatherByEmail } from "../controllers/UserController";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
 await getUserWeatherByEmail(req, res, next);
});

export default router;
