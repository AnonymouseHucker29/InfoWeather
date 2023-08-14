import { callSendHandler } from "./callSendHandler.js";
import { delayHandler } from "../misc/delayHandler.js";
import {
  markMessageAsSeen,
  showTypingIndicator,
} from "../misc/typingAndSeenIndicator.js";
import { fetchWeatherDataByName } from "../sources.js";
import { tempConverter, miscConverter } from "../misc/conversions.js";

export async function weatherHandler(
  sender_psid,
  received_message,
  message_id
) {
  try {
    let location = received_message;

    const weatherData = await fetchWeatherDataByName(location);

    if (weatherData.cod !== 200) {
      await markMessageAsSeen(sender_psid, message_id);
      await showTypingIndicator(sender_psid, received_message.mid);

      const errorMessage = {
        text: `There's no available weather data for "${location}".`,
      };
      callSendHandler(sender_psid, errorMessage);
      return;
    }
    if (location.toLowerCase() !== weatherData.name.toLowerCase()) {
      await markMessageAsSeen(sender_psid, message_id);
      await showTypingIndicator(sender_psid, received_message.mid);

      location = weatherData.name;

      const locationMessage = {
        text: `I couldn't find the weather for ${received_message}. Here's the weather for ${location} instead.`,
      };
      callSendHandler(sender_psid, locationMessage);
    }

    await markMessageAsSeen(sender_psid, message_id);
    await showTypingIndicator(sender_psid, received_message.mid);
    await delayHandler(1000);

    const temp = tempConverter(weatherData);
    const misc = miscConverter(weatherData);

    const weatherMessage = {
      text: `Latest weather update:  ${misc.currentTime} (${misc.name} time):\n\nThe weather in ${misc.name}, ${misc.country} (${misc.lat}, ${misc.lon}) is ${temp.celsius}°C or ${temp.fahrenheit}°F having ${misc.desc}.
                    \n\nAdditional informations:\n\nTimezone: ${misc.timezone}\nClouds: ${misc.clouds}%\nHumidity: ${misc.humidity}%\nSunrise: ${misc.sunriseTime}\nSunset: ${misc.sunsetTime}\n`,
    };
    callSendHandler(sender_psid, weatherMessage);

    await delayHandler(1000);
    await markMessageAsSeen(sender_psid, message_id);
    await showTypingIndicator(sender_psid, received_message.mid);

    const confirmMessage = {
      text: "Do you want me to provide weather info for another location?",
      quick_replies: [
        {
          content_type: "text",
          title: "Yes",
          payload: "OTHER_LOCATIONS_YES",
        },
        {
          content_type: "text",
          title: "No",
          payload: "OTHER_LOCATIONS_NO",
        },
      ],
    };
    callSendHandler(sender_psid, confirmMessage);
  } catch (error) {
    console.error("Unable to send message:", error);
  }
}
