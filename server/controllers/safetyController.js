import prisma from "../db.js";
import { sendNotification } from "./userController.js";
import { AnnouncementType, EmergencyLevel } from "@prisma/client";

export const publishEmergency = async (req, res) => {
  try {
    const { message, location, emergencyLevel, type, latitude, longitude } =
      req.body;

    const publishedEmergency = await prisma.safetyAlert.create({
      data: {
        message: message,
        location: location ? location : "---",
        emergencyLevel: emergencyLevel ? emergencyLevel : EmergencyLevel.MEDIUM,
        type: type ? type : AnnouncementType.ANNOUNCEMENT,
        latitude: type === AnnouncementType.EMERGENCY ? latitude : null,
        longitude: type === AnnouncementType.EMERGENCY ? longitude : null,
      },
    });

    if (type === AnnouncementType.EMERGENCY) {
      sendNotification(
        {
          title: "Emergency Alert",
          body: message,
        },
        "emergency",
        {
          topic: "emergency",
          message: message,
          type: "emergency",
          emergencyLevel: emergencyLevel,
          location: location,
          latitude: latitude,
          longitude: longitude,
        },
        "https://bidyarthi.vercel.app/userdashboard/notification"
      );
    } else {
      sendNotification(
        {
          title: "Safety Alert",
          body: message,
        },
        "announcement",
        {
          topic: "announcement",
          message: message,
          type: AnnouncementType.ANNOUNCEMENT,
          emergencyLevel: emergencyLevel,
          location: location,
        },
        "https://bidyarthi.vercel.app/userdashboard/notification"
      );
    }
    res.status(201).json(publishedEmergency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const safetyAlerts = await prisma.safetyAlert.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(safetyAlerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
