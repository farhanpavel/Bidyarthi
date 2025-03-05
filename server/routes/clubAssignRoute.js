import express from "express";

import { jwtAuthentication } from "../middlewares/authMiddleware.js";
import {
  eventAssignforUser,
  getFlag,
  getClubEventsWithRSVPs,
} from "../controllers/assignClubController.js";
const clubAssignRouter = express.Router();

clubAssignRouter.post("/", jwtAuthentication, eventAssignforUser);
clubAssignRouter.get("/:id", jwtAuthentication, getFlag);
clubAssignRouter.get("/event/all", jwtAuthentication, getClubEventsWithRSVPs);

export default clubAssignRouter;
