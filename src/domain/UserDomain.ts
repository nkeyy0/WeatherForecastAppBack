import { repository } from "../repository/UserRepository";
import { loginUserMapper } from "../Mappers/UserMapper";
import { createJWT } from "../helpers/createJWT";
import {
  ILoginData,
  IUser,
  IUserCity,
  IUserInfoForJWT,
  IUserInfoFromRepo,
} from "../interfaces/interfaces";

export const domain = {
  getUserCityByEmail: async (email: string) => {
      const result: IUserCity = await repository.getUserCityByEmail(email);
      return result;
   
  },
  createUserDomain: async (User: IUser) => {
    const isUserCreate: boolean = await repository.createUser(User);
    return isUserCreate;
  },
  loginUser: async (loginData: ILoginData) => {
    const userInfo = await repository.loginUser(loginData);
    const infoForJWT = loginUserMapper(userInfo);
    const jwt = await createJWT(infoForJWT);
    return jwt;
  },
  updateUserInfo: async (email: string, city: string, api: string) => {
    const userUpdateResult: boolean = await repository.updateUserInfo(
      email,
      city,
      api
    );
    return userUpdateResult;
  },
};
