import {
  domain,
} from "../domain/UserDomain";
import { getWeatherService } from "./WeatherService";
import { IUserCity, IUser, ILoginData } from "../interfaces/interfaces";

export async function createUserService(User: IUser) {
  const isUserCreate: boolean = await domain.createUserDomain(User);
  return isUserCreate;
}

export async function getUserWeatherByEmailService(email: string) {
  try {
    const userCity: IUserCity = await domain.getUserCityByEmailDomain(email);
    const weatherInfo = await getWeatherService(userCity.api, userCity.api);
    return weatherInfo;
  } catch (error) {
    error;
  }
}

export async function loginUserService(loginInfo: ILoginData) {
    try {
        const jwt = await domain.loginUser(loginInfo);
        return jwt;
    } catch (error) {
        return error;
    }
}
