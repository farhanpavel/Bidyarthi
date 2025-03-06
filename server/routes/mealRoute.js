import express from "express";
import {
  getMeal,
  getMealByChef,
  getMealById,
  getMealForAllUser,
  getReqMeal,
  mealDelete,
  mealquantityChanger,
  postMeal,
  putPreMeal,
  uploadMiddleware,
} from "../controllers/mealController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const mealRouter = express.Router();

mealRouter.get("/", jwtAuthentication, getMeal);
mealRouter.get("/all/user/data", getMealForAllUser);

mealRouter.get("/:id", getMealById);
mealRouter.get("/data/end", jwtAuthentication, getReqMeal);
mealRouter.post("/", jwtAuthentication, putPreMeal);
mealRouter.get("/data/chef/pendingdata", jwtAuthentication, getMealByChef);
mealRouter.delete("/:id", jwtAuthentication, mealDelete);
mealRouter.put("/:id", jwtAuthentication, mealquantityChanger);

mealRouter.post("/data/all", uploadMiddleware, jwtAuthentication, postMeal);

export default mealRouter;
