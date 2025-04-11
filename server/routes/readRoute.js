import express from "express";
import multer from "multer";
import { processDocument } from "../controllers/readController.js";

const readRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

readRouter.post("/", upload.single("image"), processDocument);

export default readRouter;
