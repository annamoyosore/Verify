export default async function handler(req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    const response = await fetch(
      `https://api.sandmail.dev/messages?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SANDMAIL_API_KEY}`
        }
      }
    );

    const data = await response.json();

    res.status(200).json({
      messages: data.messages || []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}