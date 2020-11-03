import {
  createUserRepo,
  getUserCityByEmailRepo,
  loginUserRepo,
  UpdateUserInfo,
} from "../repository/UserRepository";
import {loginUserMapper} from '../Mappers/UserMapper';
import {createJWT} from '../helpers/createJWT'
import { ILoginData, IUser, IUserCity, IUserInfoForJWT, IUserInfoFromRepo } from "../interfaces/interfaces";

export const domain = {
  getUserCityByEmailDomain: async (email: string) => {
    try {
      const result: IUserCity = await getUserCityByEmailRepo(email);
      return result;
    } catch (error) {
      throw error;
    }
  },
  createUserDomain: async (User: IUser) => {
    try {
      const isUserCreate: boolean = await createUserRepo(User);
      return isUserCreate;
    } catch (error) {
      throw error;
    }
  },
  loginUser: async (loginData: ILoginData) => {
    try {
      const userInfo = await loginUserMapper(loginData);
      const jwt = await createJWT(userInfo);
      return jwt;
    } catch (error) {
      throw error;
    }
  },
  updateUserInfo: async (email:string, city: string, api: string) => {
    try {
      const userUpdateResult: boolean = await UpdateUserInfo(email, city, api);
      return userUpdateResult;
    } catch (error) {
      throw error;
    }
    
  }
};


