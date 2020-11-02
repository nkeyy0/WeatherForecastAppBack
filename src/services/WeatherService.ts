import {getWeatherFromOpenWeather, getWeatherFromWeatherstack} from '../providers/WeatherProvider';
import {OPEN_WEATHER_MAP_API, WEATHERSTACK_API} from '../constants/constants';
import {domain} from '../domain/UserDomain';

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

export async function getWeatherAgain(email: string, city: string, api: string) {
    try {
        const updateUserStatus = await domain.updateUserInfo(email, city, api);
        if(updateUserStatus){
            const result = await getWeatherService(city, api);
            return result;
        }
        else {
            const error = new Error();
            error.message = 'Update user failed';
            throw error;
        }
    } catch (error) {
        return error;
    }
}



