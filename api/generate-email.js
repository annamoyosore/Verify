export default function handler(req, res) {
  const random = Math.random().toString(36).substring(2, 10);
  const email = `${random}@sandmail.dev`;

  res.status(200).json({ email });
}