import express from "express";
import {
  extractRoutine,
  saveRoutine,
  getRoutine,
} from "../controllers/routineController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";
import multer from "multer";

const routineRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

routineRouter.post(
  "/extract-routine",
  upload.single("routineImage"),
  extractRoutine
);
routineRouter.post("/save", jwtAuthentication, saveRoutine);
routineRouter.get("/", jwtAuthentication, getRoutine);

export default routineRouter;
