import { NextFunction, Request, Response } from "express";
import {
  getUserWeatherByEmailService,
  createUserService,
  loginUserService,
} from "../services/UserService";
import { getWeatherService, getWeatherAgain } from "../services/WeatherService";
import { IUser } from "../interfaces/interfaces";
import { ErrorHandler } from "../helpers/error";
import { error } from "console";
import { nextTick } from "process";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, surname, patronymic, city, email, password } = req.body;
  const User: IUser = {
    name,
    surname,
    patronymic,
    city,
    email,
    password,
  };
  try {
    if(!name){
      throw new ErrorHandler(400, 'Bad request: Name is empty!');
    }
    if(!surname){
      throw new ErrorHandler(400, 'Bad request: Surname is empty!');
    }
    if(!patronymic){
      throw new ErrorHandler(400, 'Bad request: Patronymic is empty!');
    }
    if(!city){
      throw new ErrorHandler(400, 'Bad request: City is empty!');
    }
    if(!email){
      throw new ErrorHandler(400, 'Bad request: Email is empty!');
    }
    if(!password){
      throw new ErrorHandler(400, 'Bad request: Password is empty!');
    }
    const isUserCreated = await createUserService(User);
    if (isUserCreated) {
      return res.status(200).json({
        message: "User created successfully",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getUserWeatherByEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email: string = req.body.email;
  if (!email) {
    throw new ErrorHandler(400, "Bad request: Email is empty!");
  }
  try {
    const weatherInfo = await getUserWeatherByEmailService(email);
    res.status(200).json({
      weatherInfo,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    if (!email) {
      throw new ErrorHandler(400, "Bad request: Email is empty");
    }
    if (!password) {
      throw new ErrorHandler(400, "Bad request: Password is empty");
    }
    const loginData = {
      email,
      password,
    };
    const token = await loginUserService(loginData);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({
      message: "Login completed successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getWeatherInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, city, api } = req.body;
  try {
    if (!email) {
      throw new ErrorHandler(400, "Bad request: Email is empty!");
    }
    if (!city) {
      throw new ErrorHandler(400, "Bad request: City is empty!");
    }
    if (!api) {
      throw new ErrorHandler(400, "Bad request: Api is empty!");
    }
    const result = await getWeatherAgain(email, city, api);
    res.status(200).json({
      result,
    });
  } catch (error) {
    next(error);
  }
}
