import { Router, Request, Response, NextFunction } from "express";
import { loginUser } from "../controllers/UserController";



const router = Router();

router.post("/", async(req: Request, res: Response, next: NextFunction) => {
  await loginUser(req, res, next);
});

export default router;
