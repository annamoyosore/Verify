const BASE = "https://api.sandmail.dev/v1";

export default async function handler(req, res) {

    try {

        // 📩 CREATE INBOX
        if (req.method === "POST") {

            const response = await fetch(`${BASE}/inboxes`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.SANDMAIL_API_KEY}`
                }
            });

            const data = await response.json();

            return res.status(200).json({
                email: data.email,
                encrypted: data.encrypted,
                ttl_hours: data.ttl_hours,
                expires_at: data.expires_at
            });
        }

        // 📬 GET INBOX EMAILS
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ error: "Email required" });
        }

        const response = await fetch(`${BASE}/emails/${encodeURIComponent(email)}`, {
            headers: {
                "Authorization": `Bearer ${process.env.SANDMAIL_API_KEY}`
            }
        });

        const data = await response.json();

        return res.status(200).json({
            emails: data.emails || []
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}