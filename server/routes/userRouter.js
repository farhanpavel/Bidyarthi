import {
  getUser,
  getUserByroleFalse,
  getUserByroleTrue,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import express from "express";

const userRouter = express.Router();
userRouter.get("/", getUser);
userRouter.get("/:role/deactive", getUserByroleFalse);
userRouter.get("/:role/:id/active", getUserByroleTrue);

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
export default userRouter;
