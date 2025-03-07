import express from "express";
import {getAll, publishEmergency} from "../controllers/safetyController.js";

const safetyRouter = express.Router();

safetyRouter.post("/publish", publishEmergency)
safetyRouter.get("/", getAll)

export default safetyRouter;