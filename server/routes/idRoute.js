import express from "express";
import {
  submitStudentInfo,
  getStudentQR,
  checkStudentStatus,
  upload,
  handleQRScan,
} from "../controllers/idController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const idRouter = express.Router();

idRouter.post(
  "/submit",
  jwtAuthentication,
  upload.single("photo"),
  submitStudentInfo
);
idRouter.get("/qr", jwtAuthentication, getStudentQR);
idRouter.get("/check-status", jwtAuthentication, checkStudentStatus);
idRouter.post("/scan", handleQRScan);
export default idRouter;
