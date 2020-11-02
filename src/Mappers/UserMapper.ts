import { ILoginData, IUserInfoFromRepo } from "../interfaces/interfaces";
import { loginUserRepo } from "../repository/UserRepository";

export async function loginUserMapper(loginData: ILoginData) {
  try {
    const userInfo: IUserInfoFromRepo = await loginUserRepo(loginData);
    const name = userInfo.displayName.split(" ")[0];
    const surname = userInfo.displayName.split(" ")[1];
    const patronymic = userInfo.displayName.split(" ")[2];
    const email = userInfo.email;
    const city = userInfo.city;
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
