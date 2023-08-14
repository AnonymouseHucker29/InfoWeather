import { webhookHandler } from "./handlers/webhookHandler.js";
import express from "express";
import body_parser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

express()
  .use(body_parser.json())
  .post("/webhook", webhookHandler)
  .listen(process.env.PORT || 1337, () =>
    console.log(`webhook is listening @ port ${process.env.PORT || 1337}`)
  );
