const request = require('request');
const { callSendHandler } = require('./callSendHandler');
const { delayHandler } = require('./delayHandler');

require('dotenv').config();

function weatherHandler(sender_psid, received_message) {
    var location = received_message;

    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
    request(apiUrl, async (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const weatherData = JSON.parse(body);

            if (location.toLowerCase() !== weatherData.name.toLowerCase()) {
                location = weatherData.name;

                const locationMessage = {
                    "text": `I couldn't find the weather for ${received_message}. Here's the weather for ${location} instead.`
                };
                callSendHandler(sender_psid, locationMessage);
            }

            // Kelvin to Celsius conversion
            const celsius = Math.round(weatherData.main.temp - 273.15);

            // Kelvin to Fahrenheit conversion
            const fahrenheit = Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32);

            await delayHandler(1000);

            const desc = weatherData.weather[0].description;

            const weatherMessage1 = {
                "text": `The weather in ${location.charAt(0).toUpperCase() + location.slice(1)}, ${weatherData.sys.country} is ${celsius}°C or ${fahrenheit}°F having ${desc}.`
            }
            callSendHandler(sender_psid, weatherMessage1);

            await delayHandler(1000);

            const weatherMessage2 = {
                "text": 'Do you want me to provide weather info for another location?',
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": "Yes",
                        "payload": "OTHER_LOCATIONS_YES"
                    },
                    {
                        "content_type": "text",
                        "title": "No",
                        "payload": "OTHER_LOCATIONS_NO"
                    }
                ]
            };
            callSendHandler(sender_psid, weatherMessage2);
        } else {
            console.error("Unable to send message:" + error);

            const errorMessage = {
                "text": `There's no available weather data for "${location}".`
            };

            callSendHandler(sender_psid, errorMessage);
        }
    });
}

module.exports.weatherHandler = weatherHandler;