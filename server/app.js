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

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("hello");
});

app.listen(PORT, () => {
  console.log(`app is listening on Port ${PORT}`);
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
