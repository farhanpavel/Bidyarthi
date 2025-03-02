import express from "express";

const clubRouter = express.Router();

clubRouter.get("/", getCafe);
clubRouter.post("/", uploadMiddleware, postCafe);
// cafeRouter.put("/:id", chefAssign);
// cafeRouter.delete("/:id", chefDelete);

export default clubRouter;
