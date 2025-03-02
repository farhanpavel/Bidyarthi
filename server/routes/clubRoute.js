import express from "express";
import {
  clubAssign,
  clubDelete,
  getClub,
  postClub,
  uploadMiddleware,
} from "../controllers/clubController.js";

const clubRouter = express.Router();

clubRouter.get("/", getClub);
clubRouter.post("/", uploadMiddleware, postClub);
clubRouter.put("/:id", clubAssign);
clubRouter.delete("/:id", clubDelete);

export default clubRouter;
