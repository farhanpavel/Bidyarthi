import express from "express";
import {
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todolistController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const todoRouter = express.Router();

todoRouter.post("/add", jwtAuthentication, addTodo);
todoRouter.put("/update", updateTodo);
todoRouter.delete("/:id", deleteTodo);

export default todoRouter;
