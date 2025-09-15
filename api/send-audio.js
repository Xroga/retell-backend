// api/send-audio.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { call_id, audio_base64 } = req.body;

    const response = await axios.post(
      `https://api.retellai.com/v2/web-call/${call_id}/audio`,
      { audio_base64 },
      {
        headers: {
          Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error sending audio:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send audio" });
  }
}
