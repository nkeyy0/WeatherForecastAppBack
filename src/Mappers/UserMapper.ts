import { IUserInfoFromRepo } from "../interfaces/interfaces";

export function loginUserMapper(userInfo: IUserInfoFromRepo) {
  const name: string = userInfo.displayName.split(" ")[0];
  const surname: string = userInfo.displayName.split(" ")[1];
  const patronymic: string = userInfo.displayName.split(" ")[2];
  const email: string = userInfo.email;
  const city: string = userInfo.city;
  return {
    name,
    surname,
    patronymic,
    email,
    city,
  };
}
