import fetch from "node-fetch";

export async function getWeatherFromOpenWeather(city: string) {
  try {
    const data = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.API_KEY_FROM_OPEN_WEATHER}&units=metric`
    );
    const weatherInfo = await data.json();
    return {
      weatherInfo,
    };
  } catch (error) {
    return error;
  }
}

export async function getWeatherFromWeatherstack(city: string) {
  try {
    const data = await fetch(
      `http://api.weatherstack.com/current?access_key=${process.env.API_KEY_FROM_WEATHERSTACK}&query=${city}&units=m`
    );
    const weatherInfo = await data.json();
    return {
      weatherInfo,
    };
  } catch (error) {
    return error;
  }
}