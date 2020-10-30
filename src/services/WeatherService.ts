import fetch from "node-fetch";
import {getWeatherFromOpenWeather, getWeatherFromWeatherstack} from '../providers/WeatherProvider'
import {OPEN_WEATHER_MAP_API, WEATHERSTACK_API} from '../constants/constants'

export async function getWeatherService(city:string, api: string) {
    try {
        if(api === OPEN_WEATHER_MAP_API){
            const weatherInfo = await getWeatherFromOpenWeather(city);
            return weatherInfo;
        }
        if(api === WEATHERSTACK_API){
            const weatherInfo = await getWeatherFromWeatherstack(city);
            return weatherInfo;
        }
    } catch (error) {
        return error;
    }
}