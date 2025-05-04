import prisma from "../db.js";
import "dotenv/config";

export const gatePost = async (req, res) => {
  const { name } = req.body;

  try {
    // Find the student where the name matches the regNo
    const student = await prisma.student.findFirst({
      where: {
        regNo: name,
      },
    });
    return res.json(!!student);
  } catch (error) {
    console.error("Error in gatePost:", error);
    return res.status(500).json(false);
  }
};
