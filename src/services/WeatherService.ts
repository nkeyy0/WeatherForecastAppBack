import {
  getWeatherFromOpenWeather,
  getWeatherFromWeatherstack,
} from "../providers/WeatherProvider";
import { OPEN_WEATHER_MAP_API, WEATHERSTACK_API } from "../constants/constants";
import { ErrorHandler } from "../helpers/error";
import { IWeatherInfoForMongo } from "../interfaces/interfaces";

export const weatherService = {
  getWeather: async (city: string, api: string) => {
    if (api === OPEN_WEATHER_MAP_API) {
      const weatherInfo = await getWeatherFromOpenWeather(city);
      console.log(weatherInfo);
      const weatherInfoForMongo: IWeatherInfoForMongo = {
        temperature: weatherInfo.main.temp,
        pressure: weatherInfo.main.pressure,
        windSpeed: weatherInfo.wind.speed,
        humidity: weatherInfo.main.humidity,
        api: api,
      };
      return { api, weatherInfo, weatherInfoForMongo };
    }
    if (api === WEATHERSTACK_API) {
      const weatherInfo = await getWeatherFromWeatherstack(city);
      const weatherInfoForMongo: IWeatherInfoForMongo = {
        temperature: weatherInfo.current.temperature,
        pressure: weatherInfo.current.pressure,
        windSpeed: weatherInfo.current.wind_speed,
        humidity: weatherInfo.current.humidity,
        api: api,
      };
      console.log(weatherInfo);
      return { api, weatherInfo, weatherInfoForMongo };
    } else {
      throw new ErrorHandler(404, "API error: API not found!");
    }
  },
};
