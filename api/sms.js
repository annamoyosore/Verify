import { buffer } from "micro";
import querystring from "querystring";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ⚠️ In-memory store (upgrade to KV/DB for production)
let inboxStore = {};

export default async function handler(req, res) {

  // 📩 Twilio webhook (incoming SMS)
  if (req.method === "POST") {

    const rawBody = await buffer(req);
    const parsed = querystring.parse(rawBody.toString());

    const from = parsed.From;
    const to = parsed.To;
    const body = parsed.Body;

    if (!to) {
      return res.status(400).send("Missing 'To' number");
    }

    // create inbox if not exists
    if (!inboxStore[to]) {
      inboxStore[to] = [];
    }

    inboxStore[to].unshift({
      from,
      body,
      time: new Date().toISOString()
    });

    console.log("SMS RECEIVED:", { to, from, body });

    return res.status(200).send("OK");
  }

  // 📦 Get inbox for a specific number
  if (req.method === "GET") {

    const number = req.query.number;

    if (!number) {
      return res.status(400).json({ error: "Missing number" });
    }

    return res.status(200).json(inboxStore[number] || []);
  }

  return res.status(405).send("Method not allowed");
}
