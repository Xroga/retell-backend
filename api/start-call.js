// api/start-call.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { agent_id } = req.body;

    const response = await axios.post(
      "https://api.retellai.com/v2/web-call",
      { agent_id },
      {
        headers: {
          Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error starting RetellAI call:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to start call" });
  }
}
