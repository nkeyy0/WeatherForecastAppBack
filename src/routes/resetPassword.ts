import { Router, Request, Response, NextFunction } from "express";
import {userController} from '../controllers/UserController'

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {

  await userController.passwordReset(req, res, next);
});

export default router;
