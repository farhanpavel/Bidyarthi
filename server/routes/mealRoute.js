import express from "express";
import {
  getMeal,
  postMeal,
  uploadMiddleware,
} from "../controllers/mealController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const mealRouter = express.Router();

mealRouter.get("/", getMeal);
mealRouter.post("/", uploadMiddleware, jwtAuthentication, postMeal);

export default mealRouter;
