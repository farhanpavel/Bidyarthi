import express from "express";
import {
  getClub,
  postClub,
  uploadMiddleware,
} from "../controllers/clubController.js";

const clubRouter = express.Router();

clubRouter.get("/", getClub);
clubRouter.post("/", uploadMiddleware, postClub);
// cafeRouter.put("/:id", chefAssign);
// cafeRouter.delete("/:id", chefDelete);

export default clubRouter;
