import express from 'express' 
import body_parser from 'body-parser' 
import dotenv from 'dotenv' 
  
dotenv.config(); 
  
const app = express().use(body_parser.json());

// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  
// Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === process.env.PAGE_ACCESS_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
