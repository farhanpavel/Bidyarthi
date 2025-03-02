import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getClub = async (req, res) => {
  try {
    const busData = await prisma.club.findMany();
    res.status(200).json(busData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const clubAssign = async (req, res) => {
  try {
    const cafeData = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: true,
      },
    });
    await prisma.clubMembership.create({
      data: {
        userId: req.params.id,
        clubId: req.body.id,
      },
    });
    res.status(200).json(cafeData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const clubDelete = async (req, res) => {
  try {
    const cafeData = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: false,
      },
    });
    await prisma.clubMembership.delete({
      where: {
        userId: req.params.id,
        clubId: req.body.id,
      },
    });
    res.status(200).json(cafeData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const postClub = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "club" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newCafe = await prisma.club.create({
      data: {
        club_url: result.secure_url,
        name: req.body.name,
        description: req.body.description,
      },
    });

    res.status(201).json({ message: "Cafe added successfully", data: newCafe });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const uploadMiddleware = upload.single("file");
