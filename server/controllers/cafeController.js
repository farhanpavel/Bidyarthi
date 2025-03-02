import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getCafe = async (req, res) => {
  try {
    const cafeData = await prisma.restaurant.findMany();
    res.status(200).json(cafeData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const chefAssign = async (req, res) => {
  try {
    const cafeData = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: true,
      },
    });
    await prisma.chefAssignment.create({
      data: {
        userId: req.params.id,
        restaurantId: req.body.id,
      },
    });
    res.status(200).json(cafeData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const chefDelete = async (req, res) => {
  try {
    const cafeData = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: false,
      },
    });
    await prisma.chefAssignment.delete({
      where: {
        userId: req.params.id,
        restaurantId: req.body.id,
      },
    });
    res.status(200).json(cafeData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const postCafe = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "cafeteria" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newCafe = await prisma.restaurant.create({
      data: {
        cafe_url: result.secure_url,
        name: req.body.name,
        address: req.body.address,
      },
    });

    res.status(201).json({ message: "Cafe added successfully", data: newCafe });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const uploadMiddleware = upload.single("file");
