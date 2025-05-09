import prisma from "../db.js";

export const verifyUser = async (req, res) => {
  try {
    const userData = await prisma.verify.create({
      data: {
        regNo: req.body.regNo,
      },
    });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
