// Import dependencies
const
    request = require('request');

function callSendAPI(sender_psid, response) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": process.env.PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

function getUserProfile(sender_psid) {
    return new Promise((resolve, reject) => {
        const options = {
            uri: `https://graph.facebook.com/${sender_psid}`,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: 'first_name'
            },
            method: 'GET'
        };

        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const userProfile = JSON.parse(body);
                resolve(userProfile);
            } else {
                reject(error);
            }
        });
    });
}

function handlePostback(sender_psid, received_postback) {
    const payload = received_postback.payload;

    if (payload === "OTHER_LOCATIONS_YES") {
        const response = {
            "text": "Sure! Provide a new location by typing 'weather in (location)'."
        };
        callSendAPI(sender_psid, response);
    } else if (payload === "OTHER_LOCATIONS_NO") {
        const response = {
            "text": `Okay. If you want to use the bot again, just send 'hi' or 'hello'!`
        };
        callSendAPI(sender_psid, response);
    }
}

function handleLocation(sender_psid, received_message) {
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
                callSendAPI(sender_psid, locationMessage);
            }

            // Kelvin to Celsius conversion
            const celsius = Math.round(weatherData.main.temp - 273.15);

            // Kelvin to Fahrenheit conversion
            const fahrenheit = Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32);

            await delay(1000);

            const weatherMessage1 = {
                "text": `The weather in ${location.charAt(0).toUpperCase() + location.slice(1)}, ${weatherData.sys.country} is ${celsius}°C or ${fahrenheit}°F with ${weatherData.weather[0].description}.`
            }
            callSendAPI(sender_psid, weatherMessage1);

            await delay(1000);

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
            callSendAPI(sender_psid, weatherMessage2);
        } else {
            console.error("Unable to send message:" + error);

            const errorMessage = {
                "text": `There's no available weather data for ${location}.`
            };

            callSendAPI(sender_psid, errorMessage);
        }
    });
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = {
    callSendAPI,
    getUserProfile,
    handlePostback,
    handleLocation,
    delay
}