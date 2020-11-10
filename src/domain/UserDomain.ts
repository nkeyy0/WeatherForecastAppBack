import { firebaseUserRepository } from "../repository/FirebaseUserRepository";
import {weatherRepository} from '../repository/WeatherRepository'
import { loginUserMapper } from "../Mappers/UserMapper";
import { createJWT } from "../helpers/createJWT";
import {
  ILoginData,
  IUser,
  IUserCity,
} from "../interfaces/interfaces";

export const domain = {
  getUserCityByEmail: async (email: string) => {
      const result: IUserCity = await firebaseUserRepository.getUserCityByEmail(email);
      return result;
   
  },
  createUserDomain: async (User: IUser) => {
    const isUserCreate: boolean = await firebaseUserRepository.createUser(User);
    return isUserCreate;
  },
  loginUser: async (loginData: ILoginData) => {
    const userInfo = await firebaseUserRepository.loginUser(loginData);
    const infoForJWT = loginUserMapper(userInfo);
    const jwt = await createJWT(infoForJWT);
    return jwt;
  },
  updateUserInfo: async (email: string, city: string, api: string) => {
    const userUpdateResult: string = await firebaseUserRepository.updateUserInfo(
      email,
      city,
      api
    );
    return userUpdateResult;
  },
  setWeatherDataToMongo: async(weatherToMongo: any) => {
    const setWeatherToMongoResult = await weatherRepository.create(weatherToMongo);
    return setWeatherToMongoResult;  
  },
  getCities: async(uid: string) => {
    const cities = await weatherRepository.getCities(uid);
    return cities;
  },
  getUserUID: async (email:string) => {
    const uid: string = await firebaseUserRepository.getUserUID(email);
    return uid;
  },
  getWeatherForOneCity: async (uid: string, city:string) => {
    const weatherForCity = await weatherRepository.getWeatherForOneCity(uid, city);
    return weatherForCity;
  },
  deleteCity: async (uid:string, city: string) => {
    const deleteResult = await weatherRepository.deleteCity(uid, city);
    return deleteResult;
  }
};
