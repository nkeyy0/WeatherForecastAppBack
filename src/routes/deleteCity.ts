import { Router, Request, Response, NextFunction } from "express";
import authMiddleware from "../middleware/auth";


import { userController } from "../controllers/UserController";

const router = Router();

router.post(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.deleteUserCity(req, res, next);
  }
);

export default router;
