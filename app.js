'use strict';

// Imports from helpers.js
const { callSendAPI, handlePostback, handleLocation, getUserProfile, delay } = require('./helpers');

// Import dependencies
const
    express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json());

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object === 'page') {

        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            if (webhook_event.message) {
                if (webhook_event.message.quick_reply) {
                    handlePostback(sender_psid, webhook_event.message.quick_reply);
                } else if (webhook_event.message.text) {
                    handleMessage(sender_psid, webhook_event.message);
                }
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

async function handleMessage(sender_psid, received_message) {
    if (received_message.text) {
        if (received_message.quick_replies) {
            handlePostback(sender_psid, received_message.quick_replies);
        } else {
            const userMessage = received_message.text;

            if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('Hello') || userMessage.includes('Hi')) {
                const userProfile = await getUserProfile(sender_psid);
                const firstName = userProfile.first_name;

                const response1 = {
                    "text": `Hello, ${firstName}! I'm a bot that will provide you weather information of your desired location.`
                };
                callSendAPI(sender_psid, response1);

                await delay(1000);

                const response2 = {
                    "text": "Just type 'weather in (location)' to receive real-time weather information."
                }
                callSendAPI(sender_psid, response2);
            } else if (userMessage.toLowerCase().includes('weather in')) {
                const locationStartIndex = userMessage.toLowerCase().indexOf('weather in') + 11;
                const location = userMessage.substring(locationStartIndex).trim();
                handleLocation(sender_psid, location);
            } else {
                const response = {
                    "text": "I'm sorry, I didn't quite understand that one. Please send 'hello' or 'hi' to start the conversation."
                };
                callSendAPI(sender_psid, response);
            }
        }
    } else if (received_message.attachments && received_message.attachments[0].type === 'location') {
        // Handle location attachment
        handleLocation(sender_psid, received_message.attachments[0].payload.coordinates);
    } else {
        const response = {
            "text": "I'm sorry, I can only provide weather information. Please type 'hello' or 'hi' to start the conversation."
        };
        callSendAPI(sender_psid, response);
    }
}