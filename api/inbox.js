import { SandMail } from "sandmail";

const client = new SandMail(process.env.SANDMAIL_API_KEY);

export default async function handler(req, res) {

    try {

        // =========================
        // ⚡ GENERATE TEMP EMAIL
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

        // FETCH EMAILS FROM SANDMAIL
        const response = await client.fetchEmails(email);

        console.log("EMAIL RESPONSE:", response);

        return res.status(200).json({
            emails: response.emails || response || []
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message || "Failed to load inbox"
        });
    }
}