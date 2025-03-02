import express from "express";
import {
  getBus,
  postBus,
  uploadMiddleware,
} from "../controllers/busController.js";

const busRouter = express.Router();

busRouter.get("/", getBus);
busRouter.post("/", uploadMiddleware, postBus);
// cafeRouter.put("/:id", chefAssign);
// cafeRouter.delete("/:id", chefDelete);

export default busRouter;
