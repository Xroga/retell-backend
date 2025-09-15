// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Path helpers for static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend (index.html in public/)
app.use(express.static(path.join(__dirname, "public")));

// Retell: Start a call
app.post("/start-call", async (req, res) => {
  try {
    const { agent_id } = req.body;
    if (!agent_id) {
      return res.status(400).json({ error: "Missing agent_id" });
    }

    // Call Retell API
    const response = await fetch("https://api.retellai.com/v2/calls", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data); // includes ws_url
  } catch (err) {
    console.error("Error starting call:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Run locally or let Vercel handle exports
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app; // for Vercel
