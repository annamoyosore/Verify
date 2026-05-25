import { SandMail } from "sandmail";

const client = new SandMail(process.env.SANDMAIL_API_KEY);

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

        const response = await client.getEmails(email);

        return res.status(200).json({
            emails: response.emails || []
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message || "SandMail server error"
        });
    }
}