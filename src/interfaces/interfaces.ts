export interface UserResultType {
  name?: string | undefined;
  email?: string | undefined;
  uid?: string | undefined;
}

export interface IUser {
  name: string,
  surname: string,
  patronymic: string,
  city: string,
  email: string,
  password: string
}

export interface IUserCity {
  city: string;
  api: string;
}

export interface ILoginData{
  email: string,
  password: string,
}

export interface IUserRecord{
  displayName: string ,
  email: string,
  uid: string 
}

export interface IUserInfoFromRepo{
  displayName: string,
  email: string,
  city: string 
}

export interface IUserInfoForJWT {
  name: string,
  surname: string,
  patronymic: string,
  email: string,
  city: string
}

export interface IOpenWeatherMapInfo{
  coord: {
    lon: string,
    lat: string
  },
  weather: [{
    id: string,
    main: string,
    description: string,
    icon: string
  }],
  base: string,
  main: {
    temp: string,
    feels_like: string,
    temp_min: string,
    temp_max: string,
    pressure: string,
    humidity: string
  },
  visibility: string,
  wind: {
    speed: string,
    deg: string,
    gust: string
  },
  rain: {
    '1h'? : string
    '3h': string
  },
  clouds: {
    all: string
  },
  dt: string,
  sys: {
    type: string,
    id: string,
    country: string,
    sunrise: string,
    sunset: string
  },
  timezone: string,
  id: string,
  name: string,
  cod: string,
}

export interface IWeatherstackSucess {
  request: {
    type: string,
    query: string,
    language: string,
    unit: string
  },
  location: {
    name: string,
    country: string,
    region: string,
    lat: string,
    lon: string,
    timezone_id: string,
    localtime: string,
    localtime_epoch: string,
    utc_offset: string
  },
  current: {
    observation_time: string,
    temperature: string,
    weather_code: string,
    weather_icons: string[],
    weather_descriptions: string[],
    wind_speed: string,
    wind_degree: string,
    wind_dir: string,
    pressure: string,
    precip: string,
    humidity: string,
    cloudover: string,
    feelslike: string,
    uv_index: string,
    visibility: string,
    is_day: string
  },
}
export interface IWeatherstackError {
  success: boolean,
  error: {
      code: number,
      type: string,
      info: string
  }
}
