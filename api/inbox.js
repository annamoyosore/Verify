import { SandMail } from "sandmail";

const client = new SandMail(process.env.SANDMAIL_API_KEY);

const BASE = "https://api.sandmail.dev/v1";

export default async function handler(req, res) {

    try {

        // =========================
        // ⚡ GENERATE EMAIL
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
        // 📬 LOAD INBOX
        // =========================
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        // CORRECT EMAIL FETCH
        const response = await fetch(
            `${BASE}/emails?email=${encodeURIComponent(email)}`,
            {
                headers: {
                    "X-API-Key": process.env.SANDMAIL_API_KEY
                }
            }
        );

        const data = await response.json();

        console.log("SANDMAIL EMAIL DATA:", data);

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