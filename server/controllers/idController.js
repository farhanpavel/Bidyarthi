import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";
import cloudinary from "../cloudinaryConfig.js";
import multer from "multer";

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const submitStudentInfo = async (req, res) => {
  try {
    const { name, classRoll, regNo } = req.body;
    const userId = req.user.id; // From JWT middleware

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // First check if regNo exists in Verify table
    const verifiedRecord = await prisma.verify.findUnique({
      where: { regNo },
    });

    if (!verifiedRecord) {
      return res.status(403).json({
        error: "Registration number not verified",
        verified: false,
      });
    }

    // Check if student with this regNo already exists
    const existingStudent = await prisma.student.findUnique({
      where: { regNo },
    });

    if (existingStudent) {
      return res.status(409).json({
        error: "Student with this registration number already exists",
        exists: true,
      });
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

    // Generate QR code containing only the regNo
    const qrCode = await QRCode.toDataURL(regNo);

    // Save to database
    const student = await prisma.student.create({
      data: {
        name,
        classRoll,
        regNo,
        photoUrl: result.secure_url,
        qrCode,
        verified: true,
        userId,
        status: true,
      },
    });

    res.status(201).json({
      success: true,
      student,
      verified: true,
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

    // Generate QR code containing only the regNo (no need to update each time)
    const qrCode = await QRCode.toDataURL(student.regNo);

    res.status(200).json({
      success: true,
      qrCode: qrCode,
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

// New endpoint to handle QR code scanning
export const handleQRScan = async (req, res) => {
  try {
    const { regNo } = req.body; // The scanned QR code will contain the regNo

    if (!regNo) {
      return res.status(400).json({ error: "No registration number provided" });
    }

    // Find student by regNo
    const student = await prisma.student.findFirst({
      where: { regNo },
      select: {
        regNo: true, // Only return the registration number
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Return only the registration number
    res.status(200).json({
      success: true,
      regNo: student.regNo,
    });
  } catch (error) {
    console.error("Error handling QR scan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
