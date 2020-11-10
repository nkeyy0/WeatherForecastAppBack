import { rejects } from "assert";
import { error } from "console";
import { resolve } from "dns";
import mongoose from "mongoose";
import { ErrorHandler } from "../helpers/error";
import CityWeatherInfo from "../models/CityWeatherInfo";
export const weatherRepository = {
  create: async (weatherForMongo: any) => {
    console.log(weatherForMongo);
    try {
      const weatherInfo = new CityWeatherInfo({
        name: weatherForMongo.city,
        temperature: weatherForMongo.temperature,
        pressure: weatherForMongo.pressure,
        windSpeed: weatherForMongo.windSpeed,
        humidity: weatherForMongo.humidity,
        weatherDescription: weatherForMongo.weatherDescription,
        api: weatherForMongo.api,
        userID: weatherForMongo.updateUserUID,
      });
      weatherInfo.save((error) => {
        if (error) {
          throw error;
        } else console.log("success");
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
  getCities: async (uid: string) => {
    try {
      const cities = await new Promise((resolve, reject) => {
        CityWeatherInfo.find(
          {
            userID: uid,
          },
          "name temperature pressure windSpeed humidity api timeRequest -_id"
        )
          .sort("created")
          .exec((error, foundCities) => {
            if (error) reject(error);
            // console.log(foundCities);
            resolve(foundCities);
          });
      });
      console.log(cities);
      return cities;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getWeatherForOneCity: async (uid: string, city: string) => {
    try {
      console.log(uid, city);
      const cities = await new Promise((resolve, reject) => {
        CityWeatherInfo.find(
          {
            $and: [{ userID: uid }, { name: city }],
            // userID: uid,
            // name: city,
          },
          "name temperature pressure windSpeed humidity api timeRequest -_id"
        )
          .sort("created")
          .exec((error, foundCities) => {
            if (error) reject(error);
            if(!foundCities.length) reject(new ErrorHandler(404, 'City not found in MongoDB'));
            resolve(foundCities);
          });
      });
      // console.log(cities);
      return cities;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  deleteCity: async (uid:string, city: string) => {
    try {
      const deleteResult:boolean = await CityWeatherInfo.deleteMany({
        $and: [{ userID: uid }, { name: city }],
      }).then(() => {
        return true;
      }).catch(error => {
        throw error;
      });
      return deleteResult;
    } catch (error) {
      throw error;
    }
    
  }
};
