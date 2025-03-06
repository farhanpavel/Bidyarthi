import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import prisma from "../db.js";

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCzYKqfqW4-p1zavao-Bb3MVdYay7EHC7A"); // Replace with your Gemini API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to extract routine from image using Gemini API
export const extractRoutine = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Prepare the image data for Gemini API
    const imagePart = {
      inlineData: {
        mimeType: file.mimetype, // e.g., "image/png"
        data: file.buffer.toString("base64"), // Base64-encoded image data
      },
    };

    // Define the prompt for Gemini API
    const prompt =
      "Extract the class routine from this image and return it in JSON format. The routine includes days of the week and corresponding classes. For example: { 'SATURDAY': '9:30 AM - RM Class, 10:00 AM - Jesmin Class', 'SUNDAY': '11:00 AM - General Class' }";

    // Use Gemini API to extract text from the image
    const result = await model.generateContent([prompt, imagePart]);

    // Get the extracted text
    const extractedText = result.response.text();

    // Parse the extracted text into a structured schedule
    const schedule = parseRoutineText(extractedText);

    res.status(200).json({ schedule });
  } catch (error) {
    console.error("Error extracting routine:", error);
    res.status(500).json({ error: "Failed to extract routine" });
  }
};

// Helper function to parse the routine text into JSON
const parseRoutineText = (text) => {
  try {
    // Remove Markdown formatting (e.g., ```json and ```)
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse the cleaned text as JSON
    const schedule = JSON.parse(cleanedText);
    return schedule;
  } catch (error) {
    console.error("Error parsing extracted text:", error);
    return {};
  }
};

// Save routine to the database
export const saveRoutine = async (req, res) => {
  const userId = req.user.id;
  const { schedule } = req.body;

  try {
    const routine = await prisma.routine.upsert({
      where: { userId },
      update: { schedule },
      create: { userId, schedule },
    });

    res.status(200).json(routine);
  } catch (error) {
    console.error("Error saving routine:", error);
    res.status(500).json({ error: "Failed to save routine" });
  }
};

// Fetch routine from the database
export const getRoutine = async (req, res) => {
  const userId = req.user.id;

  try {
    const routine = await prisma.routine.findFirst({
      where: { userId },
      include: { todolist: true },
    });

    res.status(200).json(routine || { schedule: {}, todolist: [] });
  } catch (error) {
    console.error("Error fetching routine:", error);
    res.status(500).json({ error: "Failed to fetch routine" });
  }
};
