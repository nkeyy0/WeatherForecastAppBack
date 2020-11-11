import { NextFunction, Request, Response } from "express";
import { body, validationResult, query } from "express-validator";

export const getWeatherValidatorRules = () => {
  return [
    query("email").isEmail(),
    query("city").isLength({min:1, max: 40}),
    query('api').isLength({min:3, max: 40})
  ];
};

export function getWeatherValidator(
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
