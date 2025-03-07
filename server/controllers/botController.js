import { GoogleGenerativeAI } from "@google/generative-ai";

import prisma from "../db.js";
import multer from "multer";
const genAI = new GoogleGenerativeAI("AIzaSyCzYKqfqW4-p1zavao-Bb3MVdYay7EHC7A"); // Replace with your actual API key
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
  const { prompt } = req.body; // User's prompt

  try {
    // Fetch the project description from the database
    const projectDescription = await prisma.chatbotInteraction.findFirst({
      orderBy: {
        createdAt: "desc", // Get the latest project description
      },
    });

    if (!projectDescription) {
      return res.status(404).json({ error: "No project description found" });
    }

    // Combine the project description and user prompt
    const fullPrompt = `
      Project Description: ${projectDescription.description}
      User Prompt: ${prompt}
      give response in just 1 line write in bangla
    `;

    // Generate AI response
    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.text();

    // Return the AI response to the client
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Error in getBotResponse:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};
