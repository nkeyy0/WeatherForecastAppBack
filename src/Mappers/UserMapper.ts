import { use } from "passport";
import { ErrorHandler } from "../helpers/error";
import { ILoginData, IUserInfoFromRepo } from "../interfaces/interfaces";
import { loginUserRepo } from "../repository/UserRepository";

export async function loginUserMapper(loginData: ILoginData) {
  try {
    const userInfo = await loginUserRepo(loginData);
    const name = userInfo.displayName.split(" ")[0];
    const surname = userInfo.displayName.split(" ")[1];
    const patronymic = userInfo.displayName.split(" ")[2];
    const email: string = userInfo.email;
    const city: string = userInfo.city;
    return {
      name,
      surname,
      patronymic,
      email,
      city,
    };
  } catch (error) {
    throw error;
  }
}
