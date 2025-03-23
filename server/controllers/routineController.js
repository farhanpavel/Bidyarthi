import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import prisma from "../db.js";
import "dotenv/config";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Replace with your Gemini API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const extractRoutine = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePart = {
      inlineData: {
        mimeType: file.mimetype,
        data: file.buffer.toString("base64"),
      },
    };

    const prompt =
      "Extract the class routine from this image and return it in JSON format. The routine includes days of the week and corresponding classes. For example: { 'SATURDAY': '9:30 AM - RM Class, 10:00 AM - Jesmin Class', 'SUNDAY': '11:00 AM - General Class' }";

    const result = await model.generateContent([prompt, imagePart]);

    const extractedText = result.response.text();

    const schedule = parseRoutineText(extractedText);

    res.status(200).json({ schedule });
  } catch (error) {
    console.error("Error extracting routine:", error);
    res.status(500).json({ error: "Failed to extract routine" });
  }
};

const parseRoutineText = (text) => {
  try {
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const schedule = JSON.parse(cleanedText);
    return schedule;
  } catch (error) {
    console.error("Error parsing extracted text:", error);
    return {};
  }
};

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
