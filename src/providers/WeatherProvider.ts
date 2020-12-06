import fetch, { Response } from "node-fetch";
import {
  OPEN_WEATHER_ERROR_NOT_FOUND,
  WEATHERSTACK_ERROR_NOT_FOUND,
} from "../constants/constants";
import { ErrorHandler } from "../helpers/error";
import { IOpenWeatherMapInfo } from "../interfaces/interfaces";

export async function getWeatherFromOpenWeather(city: string) {
  const data: Response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.API_KEY_FROM_OPEN_WEATHER}&units=metric`
  );
  const weatherInfo: IOpenWeatherMapInfo = await data.json();
  if (weatherInfo.cod === OPEN_WEATHER_ERROR_NOT_FOUND) {
    throw new ErrorHandler(404, "API[OpenWeatherMap] error: City not found");
  }
  return {
    ...weatherInfo,
  };
}

export async function getWeatherFromWeatherstack(city: string) {
  const data: Response = await fetch(
    `http://api.weatherstack.com/current?access_key=${process.env.API_KEY_FROM_WEATHERSTACK}&query=${city}&units=m`
  );
  const weatherInfo = await data.json();
  if (
    weatherInfo.hasOwnProperty("error") &&
    weatherInfo.error.code === WEATHERSTACK_ERROR_NOT_FOUND
  ) {
    throw new ErrorHandler(404, "API[Weatherstack] error: City not found");
  }
  return {
    ...weatherInfo,
  };
}

export async function getWeatherForFiveDaysFromOpenWeather(city: string) {
  const data: Response = await fetch(
    `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY_FROM_OPEN_WEATHER}`
  );
  const weatherInfoForFiveDays: IOpenWeatherMapInfo = await data.json();
  if (weatherInfoForFiveDays.cod === OPEN_WEATHER_ERROR_NOT_FOUND) {
    throw new ErrorHandler(404, "API[OpenWeatherMap] error: City not found");
  }
  return {
    ...weatherInfoForFiveDays,
  };
}

export async function getWeatherForFiveDaysFromWeatherStack(city: string) {
  const data: Response = await fetch(
    `http://api.weatherstack.com/forecast?access_key=${process.env.API_KEY_FROM_WEATHERSTACK}&query=${city}&forecast_days=${5}&hourly=0`
  );
  const weatherInfoForFiveDays = await data.json();
  if (
    weatherInfoForFiveDays.hasOwnProperty("error") &&
    weatherInfoForFiveDays.error.code === WEATHERSTACK_ERROR_NOT_FOUND
  ) {
    throw new ErrorHandler(404, "API[Weatherstack] error: City not found");
  }
  return {
    ...weatherInfoForFiveDays,
  };
}
