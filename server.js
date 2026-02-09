const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Make sure node-fetch is installed
require('dotenv').config(); // Load environment variables

const GROQ_API_KEY = process.env.GROQ_API_KEY; // ✅ Only use environment variable

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("chanduAI backend running with Groq 🚀");
});

// chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Please type a message." });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are ShifaAI, a helpful AI assistant." },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      }
    );

    const data = await response.json();
    console.log("🟢 Groq response:", data);

    if (!data.choices) {
      return res.json({ reply: data.error?.message || "Groq API error" });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.json({ reply: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running at http://localhost:3000");
});
