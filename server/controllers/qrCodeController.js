import JimpPackage from "jimp";
const Jimp = JimpPackage.default ? JimpPackage.default : JimpPackage;
import qrCode from "qrcode-reader";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const qrPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Read and pre-process the image
    const image = await Jimp.read(req.file.buffer).then((img) => {
      // Enhance image for better QR detection
      return img
        .quality(100) // Highest quality
        .contrast(0.5) // Increase contrast
        .greyscale(); // Convert to grayscale
    });

    const qr = new qrCode();

    const result = await new Promise((resolve, reject) => {
      qr.callback = (err, value) => {
        if (err) {
          // Handle specific QR decoding errors
          if (err.message.includes("locator degree")) {
            reject(new Error("QR code is damaged or not fully visible"));
          } else {
            reject(err);
          }
        } else {
          resolve(value);
        }
      };
      qr.decode(image.bitmap);
    });

    res.json({
      success: true,
      data: {
        result: result.result,
        points: result.points,
      },
    });
  } catch (error) {
    console.error("Error decoding QR code:", error);
    res.status(500).json({
      success: false,
      error: "Failed to decode QR code",
      details: error.message || String(error), // Safe error message handling
      suggestion:
        "Ensure the QR code is clear, unobstructed, and occupies most of the image",
    });
  }
};

export const uploadMiddleware = upload.single("photo");
