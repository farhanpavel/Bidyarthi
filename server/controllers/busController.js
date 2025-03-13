import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import multer from "multer";
import { sendDataMessage, sendNotification } from "./userController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getBus = async (req, res) => {
  try {
    const busData = await prisma.busRoute.findMany();
    res.status(200).json(busData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getAssignedBus = async (req, res) => {
  const userId = req.user.id;
  try {
    const busData = await prisma.busRoute.findMany({
      where: {
        busDriverAssignments: {
          userId: userId,
        },
      },
    });
    res.status(200).json(busData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getSingleBus = async (req, res) => {
  try {
    const busData = await prisma.busRoute.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(busData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const BusAssign = async (req, res) => {
  try {
    const busData = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: true,
      },
    });
    await prisma.busDriverAssignment.create({
      data: {
        userId: req.params.id,
        routeId: req.body.id,
      },
    });
    res.status(200).json(busData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const BusDelete = async (req, res) => {
  try {
    const busData = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: false,
      },
    });
    await prisma.busDriverAssignment.create({
      data: {
        userId: req.params.id,
        routeId: req.body.id,
      },
    });
    res.status(200).json(busData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const postBus = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "bus" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newCafe = await prisma.busRoute.create({
      data: {
        bus_url: result.secure_url,
        busNum: req.body.busNum,
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        schedule: req.body.schedule,
      },
    });

    res.status(201).json({ message: "Cafe added successfully", data: newCafe });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { currentLatitude, currentLongitude } = req.body; // Match frontend field names

    // Ensure ID is correctly extracted
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Bus ID is required" });
    }

    // Update the bus location in the database
    const busData = await prisma.busRoute.update({
      where: { id },
      data: { currentLatitude, currentLongitude },
    });

    const currentLatitudeStr = currentLatitude.toString();
    const currentLongitudeStr = currentLongitude.toString();

    // Send real-time data to WebSocket
    await sendDataMessage(
      {
        currentLatitude: currentLatitudeStr,
        currentLongitude: currentLongitudeStr,
      },
      `bus-${id}`
    );

    // Send notification
    await sendNotification(
      {
        title: `Bus Update: ${busData.busNum}`,
        body: `Bus ${busData.busNum} is at Lat: ${currentLatitudeStr}, Long: ${currentLongitudeStr}`,
      },
      `bus-${id}-notifications`,
      {
        currentLatitude: currentLatitudeStr,
        currentLongitude: currentLongitudeStr,
      }
    );

    res.status(200).json(busData);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
};

export const uploadMiddleware = upload.single("file");
