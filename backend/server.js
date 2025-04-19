import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/itinerary", async (req, res) => {
  const { from, to } = req.body;
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AGENTICA_API_KEY}`,
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "agentica-org/deepcoder-14b-preview:free",
      messages: [
        {
          role: "system",
          content: "You are a travel assistant that builds day-by-day road trip itineraries.",
        },
        {
          role: "user",
          content: `Plan a road trip itinerary from ${from} to ${to}, driving up to 8.5 hours per day. Include stops and day-wise descriptions.`,
        },
      ],
    })
  });
  const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AGENTICA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepcoder-14b-preview",
      messages: [
        {
          role: "system",
          content: "You are a travel assistant that builds day-by-day road trip itineraries.",
        },
        {
          role: "user",
          content: `Plan a road trip itinerary from ${from} to ${to}, driving up to 8.5 hours per day. Include stops and day-wise descriptions.`,
        },
      ],
    }),
  });

  const data = await response.json();
  res.json(data);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});