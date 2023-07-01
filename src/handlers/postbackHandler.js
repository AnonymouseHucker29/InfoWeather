const callSendHandler = require("./callSendHandler");

function postbackHandler(sender_psid, received_postback) {
    const payload = received_postback.payload;

    if (payload === "OTHER_LOCATIONS_YES") {
        const response = {
            "text": "Sure! Provide a new location by typing 'weather in (location)'."
        };
        callSendHandler(sender_psid, response);
    } else if (payload === "OTHER_LOCATIONS_NO") {
        const response = {
            "text": `Okay. If you want to use the bot again, just send 'hi' or 'hello'!`
        };
        callSendHandler(sender_psid, response);
    }
}

module.exports = {
    postbackHandler
};