import { weatherHandler } from "./weatherHandler.js"
import { postbackHandler } from "./postbackHandler.js"
import { callSendHandler } from "./callSendHandler.js"
import { delayHandler } from "./delayHandler.js"
import { userProfileHandler } from "./misc/userProfileHandler.js"
import { markMessageAsSeen, showTypingIndicator } from "./misc/typingAndSeenIndicator.js"

export async function messageHandler(sender_psid, received_message, message_id) {
    try {
        if (received_message.text) {
            if (received_message.quick_replies) {
                postbackHandler(sender_psid, received_message.quick_replies);
            } else {
                const userMessage = received_message.text;

                if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {

                    await markMessageAsSeen(sender_psid, message_id);
                    await showTypingIndicator(sender_psid, received_message.mid);

                    let userProfile = await userProfileHandler(sender_psid);
                    const firstName = userProfile.first_name;

                    const response1 = {
                        "text": `Hello, ${firstName}! I'm a bot that will provide you weather information of your desired location.`
                    };
                    callSendHandler(sender_psid, response1);

                    await delayHandler(1000);

                    await markMessageAsSeen(sender_psid, message_id);
                    await showTypingIndicator(sender_psid, received_message.mid);

                    const response2 = {
                        "text": "Just type 'weather in (location)' to receive real-time weather information."
                    }
                    await callSendHandler(sender_psid, response2);
                } else if (userMessage.toLowerCase().includes('weather in')) {

                    const locationStartIndex = userMessage.toLowerCase().indexOf('weather in') + 11;
                    const location = userMessage.substring(locationStartIndex).trim();

                    await weatherHandler(sender_psid, location);
                } else {

                    await markMessageAsSeen(sender_psid, message_id);
                    await showTypingIndicator(sender_psid, received_message.mid);
                    const response = {
                        "text": "I'm sorry, I didn't quite understand that one. Please send 'hello' or 'hi' to start the conversation."
                    };
                    await callSendHandler(sender_psid, response);
                }
            }
        } else if (received_message.attachments && received_message.attachments[0].type === 'location') {
            // Handle location attachment
            weatherHandler(sender_psid, received_message.attachments[0].payload.coordinates);
        } else {
            await markMessageAsSeen(sender_psid, message_id);
            await showTypingIndicator(sender_psid, received_message.mid);
            const response = {
                "text": "I'm sorry, I can only provide weather information. Please type 'hello' or 'hi' to start the conversation."
            };
            callSendHandler(sender_psid, response);
        }
    } catch (error) {
        console.log(error);
    }
}