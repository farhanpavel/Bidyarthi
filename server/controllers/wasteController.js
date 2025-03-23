import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import multer from "multer";
import { sendDataMessage, sendNotification } from "./userController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const analyzeGarbageImage = async (imageBuffer) => {
  try {
    const inputPrompt = `Analyze this image and provide the following details in a structured JSON format:
    {
      "type": "Type of Garbage",
      "weight": "Estimated Weight",
      "description": "Brief Description"
    }
    Ensure the response is in English and strictly follows the above JSON format.`;

    // Convert the image buffer to a base64 string
    const base64Image = imageBuffer.toString("base64");

    // Format the input for the AI model
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            { text: inputPrompt },
            {
              inlineData: {
                mimeType: "image/*", // Adjust the mimeType if needed (e.g., "image/png")
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    // Send the request to the AI model
    const response = await model.generateContent(request);

    // Extract the response text
    const responseText = response.response.text();

    // Parse the response into JSON
    const jsonStartIndex = responseText.indexOf("{");
    const jsonEndIndex = responseText.lastIndexOf("}") + 1;
    const jsonResponse = responseText.slice(jsonStartIndex, jsonEndIndex);

    const analysisResult = JSON.parse(jsonResponse);

    return analysisResult;
  } catch (error) {
    console.error("Error analyzing garbage image:", error);
    throw new Error("Failed to analyze garbage image.");
  }
};

export const processGarbageReport = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    const imageBuffer = req.file.buffer; // Image from multer upload

    // Analyze the image using the AI model
    const analysisResult = await analyzeGarbageImage(imageBuffer);

    // Return the result to the frontend
    return res.status(200).json({
      success: true,
      analysisResult,
    });
  } catch (error) {
    console.error("Error processing garbage report:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const wasteGet = async (req, res) => {
  const wasteData = await prisma.garbageCollection.findMany({
    include: {
      user: true,
    },
  });
  res.status(200).json(wasteData);
};

export const wastePost = async (req, res) => {
  const userId = req.user.id;

  try {
    // Validate request body and file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const requiredFields = [
      "location",
      "longitude",
      "latitude",
      "description",
      "garbageType",
      "garbageWeight",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "waste" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Create new waste record in the database
    const newWaste = await prisma.garbageCollection.create({
      data: {
        garbagePic: result.secure_url,
        location: req.body.location,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        description: req.body.description,
        garbageType: req.body.garbageType,
        garbageWeight: req.body.garbageWeight,
        userId,
      },
    });

    // Fetch user and cleaner details
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    const cleaner = await prisma.user.findFirst({
      where: {
        role: "cleaner",
      },
    });

    if (!cleaner) {
      console.error("No cleaner found in the database.");
      return res.status(201).json({
        message:
          "Waste added successfully, but no cleaner found for notification.",
        data: newWaste,
      });
    }

    const wasteuserId = cleaner.id;

    // Prepare notification data
    const notificationData = {
      garbagePic: String(result.secure_url),
      location: String(req.body.location),
      longitude: String(req.body.longitude),
      latitude: String(req.body.latitude),
      description: String(req.body.description),
      garbageType: String(req.body.garbageType),
      garbageWeight: String(req.body.garbageWeight),
      topic: `waste-${wasteuserId}`,
      userName: user.name, // Include the user's name in the notification
    };

    console.log("Notification Data:", notificationData);

    // Send data message to FCM
    await sendDataMessage(notificationData, `waste-${wasteuserId}`);

    // Send notification to the cleaner
    await sendNotification(
      {
        title: "New Waste Record Received",
        body: `Waste: ${req.body.description} (Reported by ${user.name})`,
      },
      `waste-${wasteuserId}-notifications`
    );

    // Return success response
    res.status(201).json({
      message: "Waste added successfully",
      data: newWaste,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
export const wasteDelete = async (req, res) => {
  const waste = await prisma.garbageCollection.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(waste);
};

export const wasteUserGet = async (req, res) => {
  const waste = await prisma.user.findFirst({
    where: {
      role: "cleaner",
    },
  });
  res.status(200).json(waste);
};
export const uploadMiddleware = upload.single("file");
