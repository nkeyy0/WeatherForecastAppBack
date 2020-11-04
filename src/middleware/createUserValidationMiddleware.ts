import { IUser } from "../interfaces/interfaces";
import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers/error";
import { body, validationResult } from "express-validator";

export const createUserValidationRules = () => {
  return [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").isLength({ min: 2, max: 40 }),
    body("surname").isLength({ min: 2, max: 40 }),
    body("city").isLength({min: 1, max: 40})
  ];
};

export function createUserValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors: { [x: string]: any; }[] = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(400).json({
      errors: extractedErrors,
    });
}
