import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import { createComment } from "../controllers/comment.controller.js";

const router = new Router();

router.post("/add/:postId", protectedRoute, createComment);

export default router;
