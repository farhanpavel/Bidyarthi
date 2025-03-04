import express from "express";
import {
  BusAssign,
  BusDelete,
  getBus, getSingleBus,
  postBus,
  uploadMiddleware,
} from "../controllers/busController.js";

const busRouter = express.Router();

busRouter.get("/", getBus);
busRouter.get("/:id", getSingleBus);
busRouter.post("/", uploadMiddleware, postBus);
busRouter.put("/:id", BusAssign);
busRouter.delete("/:id", BusDelete);

export default busRouter;
