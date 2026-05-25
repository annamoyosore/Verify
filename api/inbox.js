const BASE = "https://api.sandmail.dev/v1";

export default async function handler(req, res) {
    const apiKey = process.env.SANDMAIL_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "Missing SANDMAIL_API_KEY in Vercel environment variables"
        });
    }

    try {

        // =========================
        // ⚡ CREATE INBOX (GENERATE EMAIL)
        // =========================
        if (req.method === "POST") {

            const response = await fetch(`${BASE}/inboxes`, {
                method: "POST",
                headers: {
                    "X-API-Key": apiKey,
                    "Content-Type": "application/json"
                }
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                return res.status(500).json({
                    error: "Invalid JSON response from SandMail",
                    raw: text
                });
            }

            if (!response.ok) {
                return res.status(response.status).json({
                    error: "SandMail failed to create inbox",
                    details: data
                });
            }

            return res.status(200).json({
                email: data.email,
                encrypted: data.encrypted,
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
                    "X-API-Key": apiKey
                }
            }
        );

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({
                error: "Invalid JSON response from SandMail inbox",
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
        return res.status(500).json({
            error: err.message || "Server error"
        });
    }
}