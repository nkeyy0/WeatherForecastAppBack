import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";
import {
  getWeatherValidatorRules,
  getWeatherValidator,
} from "../middleware/getWeatherInfoMiddleware";

import { userController } from "../controllers/UserController";

const router = Router();

router.post(
  "/",
  getWeatherValidatorRules(),
  getWeatherValidator,
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.updateUserInfo(req, res, next);
  }
);

export default router;
