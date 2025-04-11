import express from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import cafeRouter from "./routes/cafeRouter.js";
import busRouter from "./routes/busRoute.js";
import clubRouter from "./routes/clubRoute.js";
import mealRouter from "./routes/mealRoute.js";
import sslRouter from "./routes/sslRoute.js";
import clubAssignRouter from "./routes/clubAssignRoute.js";
import rountineRouter from "./routes/routineRoute.js";
import todoRouter from "./routes/todolistRoute.js";
import safetyRouter from "./routes/safetyRoute.js";
import botRoute from "./routes/botRoute.js";
import { MailRouter } from "./routes/mailRoute.js";
import wasteRouter from "./routes/wasteRoute.js";
import readRouter from "./routes/readRoute.js";
import idRouter from "./routes/idRoute.js";

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("hello");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:4000");
});

app.use("/api/user", userRouter);
app.use("/api/cafe", cafeRouter);
app.use("/api/bus", busRouter);
app.use("/api/club", clubRouter);
app.use("/api/meal", mealRouter);
app.use("/api/ssl", sslRouter);
app.use("/api/assign", clubAssignRouter);
app.use("/api/routine", rountineRouter);
app.use("/api/todolist", todoRouter);
app.use("/api/emergency", safetyRouter);
app.use("/api/bot", botRoute);
app.use("/api/mail", MailRouter);
app.use("/api/waste", wasteRouter);
app.use("/api/read", readRouter);
app.use("/api/studentid", idRouter);
