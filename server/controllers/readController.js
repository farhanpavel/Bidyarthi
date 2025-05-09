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

    const prompt = `Carefully analyze this document image and:
    1. Detect if the document is in Bangla or English
    2. If it's a form (application, registration, etc.):
       - Extract all field names and values if filled
       - For empty fields, provide example answers
       - Format as: "Field Name: [Example Value]"
    3. If it's informational content:
       - Summarize the key points
    4. If it contains questions:
       - Answer them directly
    5. Respond in the same language as the document (Bangla/English)

    Example form response:
    - Name: [John Doe]
    - Date of Birth: [01/01/1990]
    - Address: [123 Example Street]

    Example informational response:
    This is a notice about office closure during holidays...`;
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
