import { SandMail } from "sandmail";

const client = new SandMail(process.env.SANDMAIL_API_KEY);

const BASE = "https://api.sandmail.dev/v1";

export default async function handler(req, res) {

    try {

        // =========================
        // ⚡ CREATE TEMP EMAIL
        // =========================
        if (req.method === "POST") {

            const inbox = await client.createInbox();

            return res.status(200).json({
                email: inbox.email,
                encrypted: inbox.encrypted,
                expires_at: inbox.expires_at
            });
        }

        // =========================
        // 📬 LOAD EMAILS
        // =========================
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        // RAW API REQUEST
        const response = await fetch(
            `${BASE}/emails/${encodeURIComponent(email)}`,
            {
                headers: {
                    "X-API-Key": process.env.SANDMAIL_API_KEY
                }
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({
                error: "Invalid JSON from SandMail",
                raw: text
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to fetch inbox",
                details: data
            });
        }

        return res.status(200).json({
            emails: data.emails || []
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message || "Server error"
        });
    }
}