let inbox = []; // temporary storage (upgrade later to DB)

export default function handler(req, res) {

    // Twilio sends SMS here
    if (req.method === "POST") {

        const from = req.body.From;
        const body = req.body.Body;

        inbox.unshift({
            from,
            body,
            time: new Date().toISOString()
        });

        console.log("SMS received:", from, body);

        return res.status(200).json({ success: true });
    }

    // Dashboard reads inbox here
    if (req.method === "GET") {
        return res.status(200).json(inbox);
    }

    res.status(405).end();
}