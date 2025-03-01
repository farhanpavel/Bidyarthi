import prisma from "../db.js";

export const getUser = async (req, res) => {
  const userData = await prisma.user.findMany({});
  res.status(200).json(userData);
};
