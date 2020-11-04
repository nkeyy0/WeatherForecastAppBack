import {
  getWeatherFromOpenWeather,
  getWeatherFromWeatherstack,
} from "../providers/WeatherProvider";
import { OPEN_WEATHER_MAP_API, WEATHERSTACK_API } from "../constants/constants";
import { domain } from "../domain/UserDomain";
import { ErrorHandler } from "../helpers/error";

export const weatherService = {
  getWeather: async (city: string, api: string) => {
    if (api === OPEN_WEATHER_MAP_API) {
      const weatherInfo = await getWeatherFromOpenWeather(city);
      return { api, weatherInfo };
    }
    if (api === WEATHERSTACK_API) {
      const weatherInfo = await getWeatherFromWeatherstack(city);
      return { api, weatherInfo };
    } else {
      throw new ErrorHandler(404, "API error: API not found!");
    }
  },
};
