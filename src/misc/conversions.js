import { timezoneHandler } from "./timezoneHandler.js";

export function tempConverter(temp) {
  const celsius = Math.round(temp.main.temp - 273.15);
  const fahrenheit = Math.round(((temp.main.temp - 273.15) * 9) / 5 + 32);

  return { celsius, fahrenheit };
}

export function miscConverter(weatherData) {
  const name = weatherData.name;
  const country = weatherData.sys.country;
  const humidity = weatherData.main.humidity;
  const clouds = weatherData.clouds.all;
  const desc = weatherData.weather[0].description;
  const lat = weatherData.coord.lat;
  const lon = weatherData.coord.lon;

  // Convert the time zone offset to a valid time zone identifier
  const timezoneOffsetMinutes = weatherData.timezone / 60;
  const timezoneIdentifier = moment
    .tz(timezoneHandler(timezoneOffsetMinutes)[0])
    .format("Z");
  const timezone = timezoneHandler(timezoneOffsetMinutes)[0];

  // Get the times using the adjusted time zone identifier
  const currentTime = moment
    .unix(weatherData.dt)
    .utcOffset(timezoneIdentifier)
    .format("LT");
  const sunriseTime = moment
    .unix(weatherData.sys.sunrise)
    .utcOffset(timezoneIdentifier)
    .format("LT");
  const sunsetTime = moment
    .unix(weatherData.sys.sunset)
    .utcOffset(timezoneIdentifier)
    .format("LT");

  return {
    name,
    country,
    humidity,
    clouds,
    desc,
    lat,
    lon,
    timezone,
    currentTime,
    sunriseTime,
    sunsetTime,
  };
}
