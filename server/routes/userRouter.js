import {
  getUser,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import express from "express";

const userRouter = express.Router();
userRouter.get("/", getUser);
userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
export default userRouter;
