import { domain } from "../domain/UserDomain";
import { weatherService } from "./WeatherService";
import { IUserCity, IUser, ILoginData } from "../interfaces/interfaces";

export const userService = {
  createUser: async (User: IUser) => {
    const isUserCreate: boolean = await domain.createUserDomain(User);
    return isUserCreate;
  },
  loginUser: async (loginInfo: ILoginData) => {
    const jwt = await domain.loginUser(loginInfo);
    return jwt;
  },
  getUserWeatherByEmail: async (email: string) => {
    const userCity: IUserCity = await domain.getUserCityByEmail(email);
    const weatherInfo = await weatherService.getWeather(
      userCity.city,
      userCity.api
    );
    return weatherInfo;
  },
  updateUserInfo: async (email: string, city: string, api: string) => {
    const weatherInfo = await weatherService.getWeather(city, api);
    const updateUserStatus = await domain.updateUserInfo(email, city, api);
    if (updateUserStatus) {
      return { ...weatherInfo };
    } else {
      const error = new Error();
      error.message = "Update user failed";
      throw error;
    }
  },
};
