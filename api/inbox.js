const BASE = "https://api.sandmail.dev/v1";

export default async function handler(req, res) {
    const apiKey = process.env.SANDMAIL_API_KEY;

    // 🔐 HARD CHECK (prevents silent failure)
    if (!apiKey) {
        return res.status(500).json({
            error: "SANDMAIL_API_KEY is missing in Vercel environment variables"
        });
    }

    try {

        // =========================
        // 📩 CREATE INBOX (GENERATE EMAIL)
        // =========================
        if (req.method === "POST") {

            const response = await fetch(`${BASE}/inboxes`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            });

            const rawText = await response.text();

            let data;
            try {
                data = JSON.parse(rawText);
            } catch (e) {
                return res.status(500).json({
                    error: "Invalid JSON from SandMail (create inbox)",
                    raw: rawText
                });
            }

            // 🔴 IMPORTANT: SHOW REAL API ERROR
            if (!response.ok) {
                return res.status(response.status).json({
                    error: "SandMail rejected inbox creation",
                    status: response.status,
                    details: data
                });
            }

            return res.status(200).json({
                email: data.email,
                encrypted: data.encrypted,
                ttl_hours: data.ttl_hours,
                expires_at: data.expires_at
            });
        }

        // =========================
        // 📬 GET INBOX EMAILS
        // =========================
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        const response = await fetch(
            `${BASE}/emails/${encodeURIComponent(email)}`,
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            }
        );

        const rawText = await response.text();

        let data;
        try {
            data = JSON.parse(rawText);
        } catch (e) {
            return res.status(500).json({
                error: "Invalid JSON from SandMail (fetch inbox)",
                raw: rawText
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Failed to fetch inbox",
                status: response.status,
                details: data
            });
        }

        return res.status(200).json({
            emails: data.emails || []
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message || "Unknown server error"
        });
    }
}