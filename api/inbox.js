const BASE = "https://api.sandmail.dev/v1";

export default async function handler(req, res) {
    const apiKey = process.env.SANDMAIL_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "Missing SANDMAIL_API_KEY in Vercel"
        });
    }

    try {

        // ======================
        // ⚡ CREATE EMAIL
        // ======================
        if (req.method === "POST") {

            const response = await fetch(`${BASE}/inboxes`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            });

            const text = await response.text();
            const data = JSON.parse(text);

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

        // ======================
        // 📬 GET EMAILS
        // ======================
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

        const text = await response.text();
        const data = JSON.parse(text);

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
            error: err.message
        });
    }
}