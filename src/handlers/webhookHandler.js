import { postbackHandler } from "./postbackHandler.js";
import { messageHandler } from "./messageHandler.js";

export function webhookHandler(req, res) {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(async function (entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      let received_message = webhook_event.message;

      if (received_message) {
        if (received_message.quick_reply) {
          await postbackHandler(sender_psid, received_message.quick_reply);
        } else if (received_message.text) {
          await messageHandler(sender_psid, received_message);
        }
      } else if (webhook_event.postback) {
        await postbackHandler(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
}
