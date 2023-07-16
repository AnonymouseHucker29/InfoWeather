import { callSendHandler } from './callSendHandler.js'
import { delayHandler } from '../misc/delayHandler.js'
import { markMessageAsSeen, showTypingIndicator } from '../misc/typingAndSeenIndicator.js'
import { timezoneHandler } from '../misc/timezoneHandler.js'
import moment from 'moment-timezone'
import dotenv from 'dotenv'

dotenv.config();

export async function weatherHandler(sender_psid, received_message, message_id) {
    try {
        let location = received_message;

        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
        const response = await fetch(apiUrl);
        const weatherData = await response.json();

        if (response.status !== 200) {
            await markMessageAsSeen(sender_psid, message_id);
            await showTypingIndicator(sender_psid, received_message.mid);
            console.error('Unable to send message:', response.status);

            const errorMessage = {
                "text": `There's no available weather data for "${location}".`
            };
            callSendHandler(sender_psid, errorMessage);
            return;
        }
        if (location.toLowerCase() !== weatherData.name.toLowerCase()) {
            await markMessageAsSeen(sender_psid, message_id);
            await showTypingIndicator(sender_psid, received_message.mid);

            location = weatherData.name;

            const locationMessage = {
                "text": `I couldn't find the weather for ${received_message}. Here's the weather for ${location} instead.`
            };
            callSendHandler(sender_psid, locationMessage);
        }

        await markMessageAsSeen(sender_psid, message_id);
        await showTypingIndicator(sender_psid, received_message.mid);
        await delayHandler(1000);

        const celsius = Math.round(weatherData.main.temp - 273.15);
        const fahrenheit = Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32);
        const humidity = weatherData.main.humidity;
        const clouds = weatherData.clouds.all;
        const desc = weatherData.weather[0].description;
        const lat = weatherData.coord.lat;
        const lon = weatherData.coord.lon;

        // Convert the time zone offset to a valid time zone identifier
        const timezoneOffsetMinutes = weatherData.timezone / 60;
        const timezoneIdentifier = moment.tz(timezoneHandler(timezoneOffsetMinutes)[0]).format('Z');

        // Get the times using the adjusted time zone identifier
        const currentTime = moment.unix(weatherData.dt)
            .utcOffset(timezoneIdentifier)
            .format('LT');
        const sunriseTime = moment.unix(weatherData.sys.sunrise)
            .utcOffset(timezoneIdentifier)
            .format('LT');
        const sunsetTime = moment.unix(weatherData.sys.sunset)
            .utcOffset(timezoneIdentifier)
            .format('LT');

        const weatherMessage = {
            "text": `Weather update as of ${currentTime} (${weatherData.name} time):\n\nThe weather in ${weatherData.name}, ${weatherData.sys.country} (${lat}, ${lon}) is ${celsius}°C or ${fahrenheit}°F having ${desc}.
                    \n\nAdditional informations:\n\nTimezone: ${timezoneHandler(timezoneOffsetMinutes)[0]}\nClouds: ${clouds}%\nHumidity: ${humidity}%\nSunrise: ${sunriseTime}\nSunset: ${sunsetTime}\n`
        };
        callSendHandler(sender_psid, weatherMessage);

        await delayHandler(1000);
        await markMessageAsSeen(sender_psid, message_id);
        await showTypingIndicator(sender_psid, received_message.mid);

        const confirmMessage = {
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
        callSendHandler(sender_psid, confirmMessage);
    } catch (error) {
        console.error("Unable to send message:", error);
    }
}