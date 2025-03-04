import express from "express";
import {
  getMeal,
  getMealByChef,
  getMealById,
  getReqMeal,
  mealDelete,
  mealquantityChanger,
  postMeal,
  putPreMeal,
  uploadMiddleware,
} from "../controllers/mealController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const mealRouter = express.Router();

mealRouter.get("/", getMeal);
mealRouter.get("/:id", getMealById);
mealRouter.get("/data/end", jwtAuthentication, getReqMeal);
mealRouter.post("/", jwtAuthentication, putPreMeal);
mealRouter.get("/data/chef/pendingdata", jwtAuthentication, getMealByChef);
mealRouter.delete("/:id", jwtAuthentication, mealDelete);
mealRouter.put("/:id", jwtAuthentication, mealquantityChanger);

mealRouter.post("/", uploadMiddleware, jwtAuthentication, postMeal);

export default mealRouter;
