import express from "express";
import { processGarbageReport } from "../controllers/wasteController.js";

import multer from "multer";

const wasteRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory buffer

wasteRouter.post("/report", upload.single("image"), processGarbageReport);

export default wasteRouter;
