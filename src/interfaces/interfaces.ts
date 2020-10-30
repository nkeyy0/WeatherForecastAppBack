export interface UserResultType {
  name?: string | undefined;
  email?: string | undefined;
  uid?: string | undefined;
}

export interface IUser {
  name: string,
  surname: string,
  patronymic: string,
  city: string,
  email: string,
  password: string
}

export interface IUserCity {
  city: string;
  api: string;
}

export interface ILoginData{
  email: string,
  password: string,
}

export interface IUserRecord{
  displayName: string ,
  email: string,
  uid: string 
}

export interface IUserInfoFromRepo{
  displayName: string ,
  email: string,
  city: string 
}

export interface IUserInfoForJWT {
  name: string,
  surname: string,
  patronymic: string,
  email: string,
  city: string
}