'use strict';

const postbackHandler = require('./handlers/postbackHandler'),
    messageHandler = require('./handlers/messageHandler');

// Import dependencies
const
    express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json());

app.listen(1337, () => console.log('webhook is listening'));

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
                    postbackHandler(sender_psid, webhook_event.message.quick_reply);
                } else if (webhook_event.message.text) {
                    messageHandler(sender_psid, webhook_event.message);
                }
            } else if (webhook_event.postback) {
                postbackHandler(sender_psid, webhook_event.postback);
            }
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

messageHandler(sender_psid, received_message);