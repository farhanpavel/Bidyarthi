import express from "express";

import {
  getCafe,
  uploadMiddleware,
  postCafe,
  chefAssign,
  chefDelete,
} from "../controllers/cafeController.js";

const cafeRouter = express.Router();

cafeRouter.get("/", getCafe);
cafeRouter.post("/", uploadMiddleware, postCafe);
cafeRouter.put("/:id", chefAssign);
cafeRouter.delete("/:id", chefDelete);

export default cafeRouter;
