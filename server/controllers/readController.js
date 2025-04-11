import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const processDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No image uploaded",
    });
  }

  try {
    const base64Image = req.file.buffer.toString("base64");

    const prompt = `Analyze this document image and provide what the image is saying or the passage trying to say and if the pessage is a question the answer it. 
    
    Format your response in clear paragraphs.`;

    const request = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(request);
    const response = result.response;
    const analysis = response.text();

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to analyze document",
      details: error.message,
    });
  }
};
