import express from "express";
import {
  processGarbageReport,
  uploadMiddleware,
  wasteDelete,
  wasteGet,
  wastePost,
  wasteUserGet,
} from "../controllers/wasteController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

import multer from "multer";

const wasteRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory buffer

wasteRouter.post("/report", upload.single("image"), processGarbageReport);
wasteRouter.post(
  "/report/data",
  uploadMiddleware,
  jwtAuthentication,
  wastePost
);
wasteRouter.get("/", wasteGet);
wasteRouter.delete("/:id", wasteDelete);
wasteRouter.get("/data/user", wasteUserGet);

export default wasteRouter;
