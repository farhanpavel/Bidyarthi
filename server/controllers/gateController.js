import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import "dotenv/config";
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";

export const gatePost = async (req, res) => {
  const { name } = req.body;
  return res.json(true);
};
