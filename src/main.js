'use strict';

const { postbackHandler } = require('./handlers/postbackHandler');
const { messageHandler } = require('./handlers/messageHandler');

const
    express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json());

app.listen(process.env.PORT || 1337, () => console.log(`webhook is listening @ port ${process.env.PORT || 1337}`));

app.post('/webhook', (req, res) => {

    let body = req.body;

    if (body.object === 'page') {

        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            let received_message = webhook_event.message;

            if (received_message) {
                if (received_message.quick_reply) {
                    postbackHandler(sender_psid, received_message.quick_reply);
                } else if (received_message.text) {
                    messageHandler(sender_psid, received_message);
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