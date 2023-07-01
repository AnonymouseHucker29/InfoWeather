const weatherHandler = require("./weatherHandler.js"),
    postbackHandler = require("./postbackHandler.js"),
    callSendHandler = require("./callSendHandler.js"),
    delayHandler = require("./delayHandler.js");

async function messageHandler(sender_psid, received_message) {
    if (received_message.text) {
        if (received_message.quick_replies) {
            postbackHandler(sender_psid, received_message.quick_replies);
        } else {
            const userMessage = received_message.text;

            if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('Hello') || userMessage.includes('Hi')) {
                const userProfile = await getUserProfile(sender_psid);
                const firstName = userProfile.first_name;

                const response1 = {
                    "text": `Hello, ${firstName}! I'm a bot that will provide you weather information of your desired location.`
                };
                callSendHandler(sender_psid, response1);

                await delayHandler(1000);

                const response2 = {
                    "text": "Just type 'weather in (location)' to receive real-time weather information."
                }
                callSendHandler(sender_psid, response2);
            } else if (userMessage.toLowerCase().includes('weather in')) {
                const locationStartIndex = userMessage.toLowerCase().indexOf('weather in') + 11;
                const location = userMessage.substring(locationStartIndex).trim();
                weatherHandler(sender_psid, location);
            } else {
                const response = {
                    "text": "I'm sorry, I didn't quite understand that one. Please send 'hello' or 'hi' to start the conversation."
                };
                callSendHandler(sender_psid, response);
            }
        }
    } else if (received_message.attachments && received_message.attachments[0].type === 'location') {
        // Handle location attachment
        weatherHandler(sender_psid, received_message.attachments[0].payload.coordinates);
    } else {
        const response = {
            "text": "I'm sorry, I can only provide weather information. Please type 'hello' or 'hi' to start the conversation."
        };
        callSendHandler(sender_psid, response);
    }
}

module.exports = {
    messageHandler
};