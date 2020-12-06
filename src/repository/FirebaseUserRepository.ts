import { auth, database, FirebaseError } from "firebase-admin";
import firebase from "firebase";
import {
  IUser,
  IUserCity,
  ILoginData,
  IUserRecord,
} from "../interfaces/interfaces";
import { DEFAULT_API } from "../constants/constants";
import { transformAuthInfo } from "passport";
import { ErrorHandler } from "../helpers/error";
export const firebaseUserRepository = {
  createUser: async (User: IUser) => {
    const id: string | void = await auth()
      .createUser({
        email: User.email,
        emailVerified: false,
        password: User.password,
        displayName: `${User.name} ${User.surname} ${User.patronymic}`,
        disabled: false,
      })
      .then((userRecord: auth.UserRecord) => {
        return userRecord.uid;
      })
      .catch((error: FirebaseError) => {
        if (error.code === "auth/email-already-exists") {
          throw new ErrorHandler(404, "Email already exist");
        }
      });
    database()
      .ref("users/" + id)
      .set({
        city: User.city,
        api: DEFAULT_API,
      });
    return true;
  },
  getUserCityByEmail: async (email: string) => {
    const userUID: string | undefined = await auth()
      .getUserByEmail(email)
      .then(function (userRecord: auth.UserRecord) {
        return userRecord.uid;
      })
      .catch((error: FirebaseError) => {
        if (error.code === "auth/user-not-found") {
          throw new ErrorHandler(404, "Database: User not found");
        } else {
          throw new ErrorHandler(404, `Database: ${error.message}`);
        }
      });
    const ref = database().ref("users/" + userUID);
    const userCity: IUserCity = await new Promise((resolve, reject) => {
      ref.on("value", (snapshot: database.DataSnapshot) => {
        resolve({ city: snapshot.val().city, api: snapshot.val().api });
      });
    });
    return userCity;
  },
  loginUser: async (loginData: ILoginData) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(loginData.email, loginData.password)
      .catch((error: FirebaseError) => {
        if (error.code === "auth/wrong-password") {
          throw new ErrorHandler(401, `Database error:${error.message}`);
        }
      });
    const userResult = await auth()
      .getUserByEmail(loginData.email)
      .then((userRecord: auth.UserRecord) => {
        return {
          displayName: userRecord.displayName,
          email: userRecord.email,
          uid: userRecord.uid,
        };
      })
      .catch((error: FirebaseError) => {
        throw new ErrorHandler(401, `Database error: ${error.message}`);
      });
    if (!userResult.displayName) {
      throw new ErrorHandler(404, "Database error: User name is empty!");
    }
    if (!userResult.email) {
      throw new ErrorHandler(404, "Database error: Email is empty!");
    }
    const ref = database().ref("users/" + userResult.uid);
    const userCitySearch: string | undefined = await new Promise(
      (resolve, reject) => {
        ref.on("value", (snapshot) => {
          console.log(snapshot.val());
          resolve(snapshot.val().city);
        });
      }
    );
    if (!userCitySearch) {
      throw new ErrorHandler(404, "Database error: City is empty!");
    }
    const userInfo = {
      displayName: userResult.displayName,
      email: userResult.email,
      city: userCitySearch,
    };
    return userInfo;
  },
  updateUserInfo: async (email: string, city: string, api: string) => {
    try {
      const userUID = await auth()
        .getUserByEmail(email)
        .then(function (userRecord) {
          return userRecord.uid;
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            throw new ErrorHandler(404, "Database: User not found");
          } else {
            throw new ErrorHandler(404, `Database: ${error.message}`);
          }
        });
      const ref = database().ref("users/" + userUID);
      await ref.update({
        city: city,
        api: api,
      });
      return userUID;
    } catch (error) {
      throw error;
    }
  },
  getUserUID: async (email: string) => {
    try {
      const userUID = await auth()
        .getUserByEmail(email)
        .then(function (userRecord) {
          return userRecord.uid;
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            throw new ErrorHandler(404, "Database: User not found");
          } else {
            throw new ErrorHandler(404, `Database: ${error.message}`);
          }
        });
      return userUID;
    } catch (error) {
      throw error;
    }
  },
  resetPassword: async (email: string) => {
    console.log(email)
    try {
      
      // auth()
      //   .generatePasswordResetLink(email)
      //   .then((link) => {
      //     console.log(link)
      //   })
      //   .catch((error) => {
      //     throw new ErrorHandler(404, `Database: ${error.message}`);
      //   });
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password reset confirmation sent. Ask user to check their email.
      }).catch(function(error) {
        throw new ErrorHandler(404, `Database: ${error.message}`);
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
};
