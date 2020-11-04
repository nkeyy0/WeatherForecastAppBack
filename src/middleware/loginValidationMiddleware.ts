import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const loginValidatorRules = () => {
  return [
    body("email").isEmail(),
    body("password").isLength({min: 6, max: 40})
  ];
};

export function loginValidator(
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
