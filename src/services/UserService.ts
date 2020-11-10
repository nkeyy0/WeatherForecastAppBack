import { domain } from "../domain/UserDomain";
import { weatherService } from "./WeatherService";
import {
  IUserCity,
  IUser,
  ILoginData,
} from "../interfaces/interfaces";

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
    const weatherResponse = await weatherService.getWeather(city, api);
    const updateUserUID = await domain.updateUserInfo(email, city, api);
    console.log(updateUserUID);
    const weatherInfoForMongo = {city ,updateUserUID, ...weatherResponse.weatherInfoForMongo}
    console.log(weatherInfoForMongo);
    await domain.setWeatherDataToMongo(weatherInfoForMongo);
    if (updateUserUID) {
      return { api ,...weatherResponse.weatherInfo };
    } else {
      const error = new Error();
      error.message = "Update user failed";
      throw error;
    }
  },
  getCities: async (email:string) => {
    const uid = await domain.getUserUID(email);
    const cities = await domain.getCities(uid);
    return cities
  },
  getWeatherForOneCity: async (city:string, email: string) => {
    const uid = await domain.getUserUID(email);
    console.log(uid);
    console.log(city);
    const weatherForOneCity = await domain.getWeatherForOneCity(uid, city);
    return weatherForOneCity;
  },
  deleteCity: async (city:string, email: string) => {
    const uid = await domain.getUserUID(email);
    const deleteStatus = await domain.deleteCity(uid, city);
    console.log(defaultStatus);
    return defaultStatus;
  }
};
