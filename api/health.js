// api/health.js
export default function handler(req, res) {
  res.status(200).send("✅ RetellAI Backend is running...");
}
