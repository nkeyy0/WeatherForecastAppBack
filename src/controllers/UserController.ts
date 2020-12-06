import { NextFunction, Request, Response } from "express";
import { userService } from "../services/UserService";
import { IUser } from "../interfaces/interfaces";
import { ErrorHandler } from "../helpers/error";
import { weatherService } from "../services/WeatherService";

export const userController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
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
      const isUserCreated = await userService.createUser(User);
      if (isUserCreated) {
        return res.status(200).json({
          message: "User created successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserWeatherByEmail: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const email: string = req.body.email;
    if (!email) {
      throw new ErrorHandler(400, "Bad request: Email is empty!");
    }
    try {
      const result = await userService.getUserWeatherByEmail(email);
      res.status(200).json({
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const loginData = {
        email,
        password,
      };
      const token = await userService.loginUser(loginData);
      res.setHeader("Authorization", `Bearer ${token}`);
    } catch (error) {
      next(error);
    }
  },
  updateUserInfo: async (req: Request, res: Response, next: NextFunction) => {
    const email = req.query.email as string;
    const city = req.query.city as string;
    const api = req.query.api as string;
    console.log(email, city, api);
    try {
      const result = await userService.updateUserInfo(email, city, api);
      res.status(200).json({
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
  getCities: async (req: Request, res: Response, next: NextFunction) => {
    const email = req.query.email as string;
    try {
      const cities = await userService.getCities(email);
      res.status(200).json({
        cities,
      });
    } catch (error) {
      next(error);
    }
  },
  getWeatherForOneCity: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const city: string = req.body.city;
    const email: string = req.body.email;
    try {
      const weatherInfoForCity = await userService.getWeatherForOneCity(
        city,
        email
      );
      res.status(200).json({
        weatherInfoForCity,
      });
    } catch (error) {
      next(error);
    }
  },
  getWeatherForFiveDays: async (req:Request, res: Response, next: NextFunction) => {
    const city = req.query.city as string
    const api = req.query.api as string;
    try {
      const weatherForFiveDays = await weatherService.getWeatherForFiveDays(api, city); 
      res.status(200).json({
        weatherForFiveDays
      })
    } catch (error) {
      next(error)
    }
  },
  deleteUserCity: async (req: Request, res: Response, next: NextFunction) => {
    const city: string = req.body.city;
    const email: string = req.body.email;
    try {
      const resultCount = await userService.deleteCity(city, email);
      console.log(resultCount);
      res.status(200).json({
        message: `${resultCount === 1 ? `${resultCount} city` : `${resultCount} cities`} removed from MongoDB`,
      });
    } catch (error) {
      next(error);
    }
  },
  passwordReset : async (req:Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email;
    try {
      const result = await userService.passwordReset(email);
      res.status(200).json({
        message: 'Email has been sent you. Please check and verify'
      })
    } catch (error) {
      next(error);
    }    
  }
};
