import express from "express";
import { postBot, getBotResponse } from "../controllers/botController.js";

const botRoute = express.Router();

// POST route to store project description
botRoute.post("/", postBot);

// POST route to get AI response based on user prompt
botRoute.post("/response", getBotResponse);

export default botRoute;
