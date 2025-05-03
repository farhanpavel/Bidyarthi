import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../cloudinaryConfig.js";
import multer from "multer";

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const submitStudentInfo = async (req, res) => {
  try {
    const { name, classRoll, regNo } = req.body;
    const userId = req.user.id;

    // Check if student already exists
    const existingStudent = await prisma.student.findFirst({
      where: { userId },
    });

    if (existingStudent) {
      return res
        .status(400)
        .json({ error: "Student information already submitted" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "student_ids" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Generate QR code with JUST the regNo as plain text
    const qrCode = await QRCode.toDataURL(regNo); // No JSON, just the regNo

    // Save to database
    const student = await prisma.student.create({
      data: {
        name,
        classRoll,
        regNo,
        photoUrl: result.secure_url,
        qrCode, // This is still base64 image for display
        qrData: regNo, // Store raw regNo separately
        verified: true,
        userId,
        status: true,
      },
    });

    res.status(201).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Error submitting student info:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const checkStudentStatus = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware

    const student = await prisma.student.findFirst({
      where: { userId },
    });

    if (!student) {
      return res.status(200).json({ exists: false });
    }

    res.status(200).json({
      exists: true,
      verified: student.status,
      studentId: student.id,
    });
  } catch (error) {
    console.error("Error checking student status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudentQR = async (req, res) => {
  try {
    const userId = req.user.id;

    let student = await prisma.student.findFirst({
      where: { userId },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Generate new QR code with JUST the regNo
    const newQrCode = await QRCode.toDataURL(student.regNo);

    student = await prisma.student.update({
      where: { id: student.id },
      data: {
        qrCode: newQrCode,
        qrData: student.regNo, // Keep raw regNo
      },
    });

    res.status(200).json({
      success: true,
      qrCode: student.qrCode, // Base64 image for display
      qrData: student.regNo, // Plain regNo for reference
      studentInfo: {
        name: student.name,
        classRoll: student.classRoll,
        regNo: student.regNo,
        photoUrl: student.photoUrl,
      },
    });
  } catch (error) {
    console.error("Error getting student QR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const verifyQRCode = async (req, res) => {
  try {
    const { scannedData } = req.body; // This will be just the regNo

    const student = await prisma.student.findFirst({
      where: { regNo: scannedData },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      success: true,
      student: {
        name: student.name,
        classRoll: student.classRoll,
        regNo: student.regNo,
        photoUrl: student.photoUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
