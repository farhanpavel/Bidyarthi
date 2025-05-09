import express from "express";
import { verifyUser } from "../controllers/verifyController.js";

const verifyRouter = express.Router();
verifyRouter.post("/", verifyUser);
export default verifyRouter;
