import { gatePost } from "../controllers/gateController.js";
import express from "express";

const gateRouter = express.Router();
gateRouter.post("/", gatePost);
export default gateRouter;
