import { Schema, model } from "mongoose";

const cityWeatherInfo = new Schema({
  name: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  timeRequest: {
    type: Date,
    required: true,
    default: Date.now,
  },
  api: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    ref: "User",
  },
});

export default model("CityWeather", cityWeatherInfo);
