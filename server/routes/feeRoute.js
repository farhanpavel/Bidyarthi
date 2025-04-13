import express from "express";
import {
  feeGet,
  feeGetByid,
  postFee,
  initiatePayment,
  successPayment,
  feeStatusCheck,
  payCheck,
} from "../controllers/feeController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const feeRouter = express.Router();
feeRouter.post("/", postFee);
feeRouter.get("/", feeGet);
feeRouter.get("/:id", feeGetByid);
feeRouter.get("/status/data/:id", jwtAuthentication, feeStatusCheck);
feeRouter.get("/payment/get", payCheck);

feeRouter.post("/init", jwtAuthentication, initiatePayment);

feeRouter.post("/success", successPayment);
export default feeRouter;
