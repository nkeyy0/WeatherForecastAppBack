import { IUserInfoForJWT } from "../interfaces/interfaces";
import jwt from 'jsonwebtoken';
import config from '../config/app'

export async function createJWT(userInfo:IUserInfoForJWT) {
    const token = jwt.sign(
        {
          name: userInfo.name,
          surname: userInfo.surname,
          patronymic: userInfo.patronymic,
          city: userInfo.city,
          email: userInfo.email,
        },
        config.jwtSecretKey,
        { expiresIn: 60 * 60 }
      );
      return token;
}