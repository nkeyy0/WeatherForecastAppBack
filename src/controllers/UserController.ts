import { Request, Response } from "express";
import {
  getUserWeatherByEmailService,
  createUserService,
  loginUserService
} from "../services/UserService";
import { getWeatherService, getWeatherAgain } from "../services/WeatherService";
import { IUser } from "../interfaces/interfaces";
import { ErrorHandler } from "../helpers/error";

export async function createUser(req: Request, res: Response) {
  const { name, surname, patronymic, city, email, password } = req.body;
  const User: IUser = {
    name,
    surname,
    patronymic,
    city,
    email,
    password,
  };
  
    const isUserCreated = await createUserService(User);
  if (isUserCreated) {
    return res.status(200).json({
      message: "User created successfully",
    });
  } 
}

export async function getUserWeatherByEmail(req: Request, res: Response) {
  const email: string = req.body.email;
  try {
    const weatherInfo = await getUserWeatherByEmailService(email);
    res.status(200).json({
      weatherInfo,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const loginData = {
    email,
    password,
  };
  try {
    const token = await loginUserService(loginData);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({
      message: "Login completed successfully",
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
}

export async function getWeatherInfo(req:Request, res: Response) {
  const {email, city, api} = req.body;
  try {
    const result = await getWeatherAgain(email, city, api);
    res.status(200).json({
      result
    })
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}
