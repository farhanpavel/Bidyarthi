import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCzYKqfqW4-p1zavao-Bb3MVdYay7EHC7A");
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
