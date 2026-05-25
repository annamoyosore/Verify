export default async function handler(req, res) {
  const email = req.query.email;

  const response = await fetch(
    "https://api.sandmail.dev/messages?email=" + email,
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
}
