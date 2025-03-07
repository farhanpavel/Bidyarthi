import express from "express";
import {publishEmergency} from "../controllers/safetyController.js";

const safetyRouter = express.Router();

safetyRouter.get("/publish", publishEmergency)

export default safetyRouter;