import express from "express";
import { postBot, getBotResponse } from "../controllers/botController.js";

const botRoute = express.Router();

botRoute.post("/", postBot);

botRoute.post("/response", getBotResponse);

export default botRoute;
