import { Request, Response } from "express";

const createUser = (req: Request, res: Response) => {
  const name: string = req.body.name;
  const surname: string = req.body.surname;
  const patronymic: string = req.body.patronymic;
  const city: string = req.body.city;
  const email: string = req.body.email;
  const password: string = req.body.password;
  return {
    name,
    surname,
    patronymic,
    password,
    city,
    email,
  };
};
