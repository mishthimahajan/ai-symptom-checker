require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MAIN AI ROUTE
app.post("/analyze", async (req, res) => {
  const { age, gender, symptoms } = req.body;

  if (!age || !gender || !symptoms) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a medical assistant AI. Give clear structured answers."
          },
          {
            role: "user",
            content: `
Patient Details:
Age: ${age}
Gender: ${gender}
Symptoms: ${symptoms}

Provide:
1. Possible Conditions
2. Severity (Low/Medium/High)
3. Recommended Doctor
4. Basic Advice
            `
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data.choices[0].message.content;

    res.json({ result });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});