import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

import prisma from "../db.js";
import multer from "multer";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export const postBot = async (req, res) => {
  const { description } = req.body;
  const botData = await prisma.chatbotInteraction.create({
    data: {
      description,
    },
  });
  res.status(200).json(botData);
};

export const getBotResponse = async (req, res) => {
  const { prompt } = req.body;

  try {
    const projectDescription = await prisma.chatbotInteraction.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!projectDescription) {
      return res.status(404).json({ error: "No project description found" });
    }

    const fullPrompt = `
      Project Description: ${projectDescription.description}
      User Prompt: ${prompt}
      give response in just 1 line write in bangla
    `;

    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.text();

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Error in getBotResponse:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};
