import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";
import {auth, database} from "firebase-admin";
import fetch from "node-fetch";
import { getUserWeatherByEmail } from "../controllers/UserController";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
 await getUserWeatherByEmail(req, res);
});

export default router;
