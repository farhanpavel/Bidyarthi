import express from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import cafeRouter from "./routes/cafeRouter.js";
import busRouter from "./routes/busRoute.js";
import clubRouter from "./routes/clubRoute.js";

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
