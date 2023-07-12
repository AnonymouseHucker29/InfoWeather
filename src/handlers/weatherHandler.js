import { callSendHandler } from './callSendHandler.js'
import { delayHandler } from './delayHandler.js'
import { markMessageAsSeen, showTypingIndicator } from './typingAndSeenIndicator.js'
import dotenv from 'dotenv'

dotenv.config();

export async function weatherHandler(sender_psid, received_message, message_id) {
    let location = received_message;

    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.OPENWEATHERMAP_API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const weatherData = await response.json();

        if (response.status === 200) {
            if (location.toLowerCase() !== weatherData.name.toLowerCase()) {

                await markMessageAsSeen(sender_psid, message_id);
                await showTypingIndicator(sender_psid, received_message.mid);

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

            await markMessageAsSeen(sender_psid, message_id);
            await showTypingIndicator(sender_psid, received_message.mid);

            const desc = weatherData.weather[0].description;

            const weatherMessage1 = {
                "text": `The weather in ${weatherData.name}, ${weatherData.sys.country} is ${celsius}°C or ${fahrenheit}°F having ${desc}.`
            };
            callSendHandler(sender_psid, weatherMessage1);

            await delayHandler(1000);

            await markMessageAsSeen(sender_psid, message_id);
            await showTypingIndicator(sender_psid, received_message.mid);

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

            await showTypingIndicator(sender_psid, received_message.mid);

            console.error("Unable to send message:" + response.status);

            const errorMessage = {
                "text": `There's no available weather data for "${location}".`
            };

            callSendHandler(sender_psid, errorMessage);
        }
    } catch (error) {
        console.error("Unable to send message:", error);
    }
}