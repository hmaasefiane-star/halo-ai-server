import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    name: "HALO AI",
    status: "online"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages must be an array."
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL,
      instructions: `
You are HALO AI.

You are a smart, friendly and helpful AI assistant.
Give accurate answers.
Explain complicated things simply.
Help with coding, games, school, ideas and everyday questions.
Never pretend you performed an action that you did not actually perform.
      `,
      input: messages.slice(-30)
    });

    res.json({
      success: true,
      message: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "HALO AI could not process your request."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HALO AI server running on port ${PORT}`);
});
