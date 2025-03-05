import express from "express";
import {
  clubAssign,
  clubDelete,
  getClub,
  postClub,
  uploadMiddleware,
  postEvent,
  getEvent,
  getEventByid,
} from "../controllers/clubController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";
const clubRouter = express.Router();

clubRouter.get("/", getClub);
clubRouter.get("/event/data", jwtAuthentication, getEvent);
clubRouter.get("/event/data/:id", getEventByid);

clubRouter.post("/", uploadMiddleware, postClub);
clubRouter.put("/:id", clubAssign);
clubRouter.delete("/:id", clubDelete);
clubRouter.post("/event/data", uploadMiddleware, jwtAuthentication, postEvent);

export default clubRouter;
