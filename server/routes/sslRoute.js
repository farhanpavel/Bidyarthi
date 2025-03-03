import express from "express";
import {
  failedPayment,
  initiatePayment,
  successPayment,
} from "../controllers/sslController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const sslRouter = express.Router();

sslRouter.post("/init", jwtAuthentication, initiatePayment);

sslRouter.post("/success", successPayment);
sslRouter.post("/fail", failedPayment);
export default sslRouter;
