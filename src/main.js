import { webhookHandler } from './handlers/webhookHandler.js'
import express from 'express'
import body_parser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config();

const app = express().use(body_parser.json());

app.listen(process.env.PORT || 1337,
    () => console.log(`webhook is listening @ port ${process.env.PORT || 1337}`)
);

app.post('/webhook', webhookHandler);