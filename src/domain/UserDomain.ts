import {
  createUserRepo,
  getUserCityByEmailRepo,
  loginUserRepo,
} from "../repository/UserRepository";
import {createJWT} from '../helpers/createJWT'
import { ILoginData, IUser, IUserCity, IUserInfoFromRepo } from "../interfaces/interfaces";

export const domain = {
  getUserCityByEmailDomain: async (email: string) => {
    try {
      const result: IUserCity | Error = await getUserCityByEmailRepo(email);
      return result;
    } catch (error) {
      return error;
    }
  },
  createUserDomain: async (User: IUser) => {
    try {
      const isUserCreate: boolean = await createUserRepo(User);
      return isUserCreate;
    } catch (error) {
      return error;
    }
  },
  loginUser: async (loginData: ILoginData) => {
    try {
      const userInfo: IUserInfoFromRepo = await loginUserRepo(loginData);
      const name = userInfo.displayName.split(' ')[0];
      const surname = userInfo.displayName.split(' ')[1];
      const patronymic = userInfo.displayName.split(' ')[2];
      const userForJWT = {
          name, 
          surname,
          patronymic,
          city: userInfo.city,
          email: userInfo.email
      }
      const jwt = await createJWT(userForJWT);
      return jwt;
    } catch (error) {
      return error;
    }
  },
};
