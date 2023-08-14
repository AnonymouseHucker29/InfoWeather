export async function fetchGeocodingData(locationName) {
  const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    locationName
  )}&limit=5&appid=${process.env.OPENWEATHERMAP_KEY}`;

  const geocodingResponse = (await fetch(geocodingAPI)).json().catch((err) => {
    console.error(err);
  });

  return geocodingResponse;
}

export async function fetchWeatherDataByName(locationName) {
  const weatherAPI = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    locationName
  )}&appid=${process.env.OPENWEATHERMAP_KEY}`;

  const weatherResponse = (await fetch(weatherAPI)).json().catch((err) => {
    console.error(err);
  });

  return weatherResponse;
}

export async function fetchWeatherDataByCoordinates(lat, lon) {
  const weatherAPI = `http://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}&appid=${process.env.OPENWEATHERMAP_KEY}`;

  const weatherResponse = (await fetch(weatherAPI)).json().catch((err) => {
    console.error(err);
  });

  return weatherResponse;
}
