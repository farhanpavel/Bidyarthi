import express from "express";
import { qrPost, uploadMiddleware } from "../controllers/qrCodeController.js";

const qrRouter = express.Router();

qrRouter.post("/send", uploadMiddleware, qrPost);

export default qrRouter;
