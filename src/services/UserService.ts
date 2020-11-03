import {
  domain,
} from "../domain/UserDomain";
import { getWeatherService } from "./WeatherService";
import { IUserCity, IUser, ILoginData } from "../interfaces/interfaces";

export async function createUserService(User: IUser) {
  try {
    const isUserCreate: boolean = await domain.createUserDomain(User);
  return isUserCreate;
  } catch (error) {
    throw error;
  }
  
}

export async function getUserWeatherByEmailService(email: string) {
  try {
    const userCity: IUserCity = await domain.getUserCityByEmailDomain(email);
    const weatherInfo = await getWeatherService(userCity.city, userCity.api);
    return weatherInfo;
  } catch (error) {
    throw error;
  }
}

export async function loginUserService(loginInfo: ILoginData) {
    try {
        const jwt = await domain.loginUser(loginInfo);
        return jwt;
    } catch (error) {
        throw error;
    }
}
