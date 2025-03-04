import express from "express";
import {
  BusAssign,
  BusDelete, getAssignedBus,
  getBus, getSingleBus,
  postBus, updateLocation,
  uploadMiddleware,
} from "../controllers/busController.js";
import {jwtAuthentication} from "../middlewares/authMiddleware.js";

const busRouter = express.Router();

busRouter.get("/", getBus);
busRouter.get("/:id", getSingleBus);
busRouter.get("/assigned/get",jwtAuthentication,getAssignedBus)
busRouter.post("/", uploadMiddleware, postBus);
busRouter.put("/:id", BusAssign);
busRouter.put("/track/:id", updateLocation);
busRouter.delete("/:id", BusDelete);

export default busRouter;
