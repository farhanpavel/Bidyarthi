import express from "express";
import { getMyMails, sendMail } from "../controllers/mailController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

export const MailRouter = express.Router();

MailRouter.post("/send", jwtAuthentication, sendMail);
MailRouter.get("/get", jwtAuthentication, getMyMails);
