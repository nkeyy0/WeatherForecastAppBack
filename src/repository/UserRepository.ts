import { auth, database, FirebaseError } from "firebase-admin";
import firebase from "firebase";
import {
  IUser,
  IUserCity,
  ILoginData,
  IUserRecord,
} from "../interfaces/interfaces";
import { DEFAULT_API } from "../constants/constants";

export async function createUserRepo(User: IUser) {
  try {
    const id: string | void = await auth()
      .createUser({
        email: User.email,
        emailVerified: false,
        password: User.password,
        displayName: `${User.name} ${User.surname} ${User.patronymic}`,
        disabled: false,
      })
      .then((userRecord) => {
        console.log("Successfully created new user:", userRecord.email);
        return userRecord.uid;
      })
      .catch((error: FirebaseError) => {
        console.log("Error creating new user:", error.code);
        if (error.code === "auth/email-already-exists") {
          throw error.code;
        }
      });
    database()
      .ref("users/" + id)
      .set({
        city: User.city,
        api: DEFAULT_API,
      });
    return true;
  } catch (error) {
    return error;
  }
}

export async function getUserCityByEmailRepo(email: string) {
  const userUID: string | undefined = await auth()
    .getUserByEmail(email)
    .then(function (userRecord) {
      return userRecord.uid;
    });
  if (userUID === undefined) {
    const error = new Error();
    error.message = "User not found";
    throw error;
  }
  console.log(userUID);
  const ref = database().ref("users/" + userUID);
  const userCity: IUserCity = await new Promise((resolve, reject) => {
    ref.on("value", (snapshot) => {
      resolve({ city: snapshot.val().city, api: snapshot.val().api });
    });
  });
  return userCity;
}

export async function loginUserRepo(loginData: ILoginData) {
  try {
    const error = await firebase
      .auth()
      .signInWithEmailAndPassword(loginData.email, loginData.password)
      .catch((error: FirebaseError) => {
        throw error.code;
      });
    const userResult = await auth()
      .getUserByEmail(loginData.email)
      .then((userRecord) => {
        return {
          displayName: userRecord.displayName,
          email: userRecord.email,
          uid: userRecord.uid,
        };
      })
      .catch((error: FirebaseError) => {
        throw error;
      });
    const ref = database().ref("users/" + userResult.uid);
    const userCitySearch: string = await new Promise(
      (resolve, reject) => {
        ref.on("value", (snapshot) => {
          console.log(snapshot.val());
          resolve(snapshot.val().city);
        });
      }
    );
    return {
        name: userResult.displayName,
        email: userResult.email,
        city: userCitySearch
    }
  } catch (error) {
      return error;
  }
}
