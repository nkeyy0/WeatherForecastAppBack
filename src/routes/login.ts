import { Router, Request, Response, NextFunction } from "express";
import { userController } from "../controllers/UserController";
import {
  loginValidatorRules,
  loginValidator,
} from "../middleware/loginValidationMiddleware";

const router = Router();

router.post(
  "/",
  loginValidatorRules(),
  loginValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.loginUser(req, res, next);
    await userController.getUserWeatherByEmail(req, res, next);
  }
);

export default router;
