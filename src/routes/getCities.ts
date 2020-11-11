import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";


import { userController } from "../controllers/UserController";

const router = Router();

router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.getCities(req, res, next);
  }
);

export default router;
