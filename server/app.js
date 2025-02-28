import express from "express";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
import hallRouter from "./routes/hallRoute.js";
import provostRouter from "./routes/provostRoute.js";
import noticeRouter from "./routes/noticeRoute.js";
import formRouter from "./routes/formRoute.js";
import roomRouter from "./routes/roomRoute.js";
import SSLCommerzPayment from "sslcommerz-lts";
import paymentRouter from "./routes/paymentRoute.js";
import sslRouter from "./routes/sslRouter.js";

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
app.use("/api/hall", hallRouter);
app.use("/api/provost", provostRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/form", formRouter);
app.use("/api/room", roomRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/ssl", sslRouter);
