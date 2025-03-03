import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getMeal = async (req, res) => {
  try {
    const mealData = await prisma.cafeteriaMenu.findMany({
      include: {
        user: {
          include: {
            chefAssignment: {
              include: {
                restaurant: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(mealData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const getMealById = async (req, res) => {
  try {
    const mealData = await prisma.cafeteriaMenu.findMany({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(mealData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const post = async (req, res) => {};

export const postMeal = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "meal" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newCafe = await prisma.cafeteriaMenu.create({
      data: {
        user_id: userId,
        meal_url: result.secure_url,
        mealName: req.body.mealName,
        mealType: req.body.mealType,
        description: req.body.description,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity),
      },
    });

    res.status(201).json({ message: "Cafe added successfully", data: newCafe });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const uploadMiddleware = upload.single("file");
