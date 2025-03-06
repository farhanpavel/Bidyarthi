import {
  getUser,
  getUserByroleFalse,
  getUserByroleTrue,
  makeNotification,
  subscribeTokenToTopic,
  unsubscribeTokenFromTopic,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import express from "express";

const userRouter = express.Router();
userRouter.get("/", getUser);
userRouter.get("/:role/deactive", getUserByroleFalse);
userRouter.get("/:role/:id/active", getUserByroleTrue);
userRouter.post("/subscribe-to-topic", subscribeTokenToTopic);
userRouter.post("/unsubscribe-from-topic", unsubscribeTokenFromTopic);
userRouter.post("/create-notification", makeNotification);

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
export default userRouter;
