import { callSendHandler } from "./callSendHandler.js"
import { markMessageAsSeen, showTypingIndicator } from './typingAndSeenIndicator.js'

export async function postbackHandler(sender_psid, received_postback, message_id) {

    const payload = received_postback.payload;

    if (payload === "OTHER_LOCATIONS_YES") {

        await markMessageAsSeen(sender_psid, message_id);
        await showTypingIndicator(sender_psid, received_postback);

        const response = {
            "text": "Sure! Provide a new location by typing 'weather in (location)'."
        };
        callSendHandler(sender_psid, response);
    } else if (payload === "OTHER_LOCATIONS_NO") {

        await markMessageAsSeen(sender_psid, message_id);
        await showTypingIndicator(sender_psid, received_postback);

        const response = {
            "text": `Okay. If you want to use the bot again, just send 'hi' or 'hello'!`
        };
        callSendHandler(sender_psid, response);
    }
}