import jwt from 'jsonwebtoken';
const secretKey = process.env.jwtSecretKey;
import {Request, Response, NextFunction} from 'express';
import config from '../config/app';

export default (req:Request, res:Response, next:NextFunction) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    res.status(401).json({
      message: "Token not provided!",
    });
    return
  }
  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, config.jwtSecretKey);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token!",
    });
  }
};
