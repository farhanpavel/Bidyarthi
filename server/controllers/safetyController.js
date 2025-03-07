import prisma from "../db.js";
import {sendNotification} from "./userController.js";
import {AnnouncementType, EmergencyLevel} from "@prisma/client";

export const publishEmergency = async (req, res) => {
    try {
        const {
            message, location, emergencyLevel
        } = req.body;
        const publishedEmergency = await prisma.safetyAlert.create({
        data: {
            message: message,
            location: location? location: null,
            emergencyLevel: emergencyLevel? emergencyLevel: EmergencyLevel.MEDIUM,
            type: AnnouncementType.EMERGENCY
        },
        });
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
                location: location
            },
            "http://localhost:3000/userdashboard/emergency"
        );
        res.status(201).json(publishedEmergency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};