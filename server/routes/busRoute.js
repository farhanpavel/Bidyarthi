import express from "express";
import {
  BusAssign,
  BusDelete,
  getBus,
  postBus,
  uploadMiddleware,
} from "../controllers/busController.js";

const busRouter = express.Router();

busRouter.get("/", getBus);
busRouter.post("/", uploadMiddleware, postBus);
busRouter.put("/:id", BusAssign);
busRouter.delete("/:id", BusDelete);

export default busRouter;
