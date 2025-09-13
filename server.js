// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ serve frontend
app.use(express.static("public"));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ RetellAI Backend is running...");
});

// ✅ Start a new Web Call session with Retell
app.post("/start-call", async (req, res) => {
  try {
    const { agent_id } = req.body;

    const response = await axios.post(
      "https://api.retellai.com/v2/web-call",
      {
        agent_id: agent_id,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error starting RetellAI call:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to start call" });
  }
});

// ✅ Send audio chunk to Retell
app.post("/send-audio", async (req, res) => {
  try {
    const { call_id, audio_base64 } = req.body;

    const response = await axios.post(
      `https://api.retellai.com/v2/web-call/${call_id}/audio`,
      {
        audio_base64: audio_base64, // frontend sends base64 audio chunks
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error sending audio:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send audio" });
  }
});

// ✅ Get AI response (audio + transcript)
app.get("/get-response/:call_id", async (req, res) => {
  try {
    const { call_id } = req.params;

    const response = await axios.get(
      `https://api.retellai.com/v2/web-call/${call_id}/response`,
      {
        headers: {
          Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching response:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response" });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 RetellAI backend running on port ${process.env.PORT}`);
});
