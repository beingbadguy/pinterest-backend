import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = new Router();

router.post("/send/:receiverId", protectedRoute, sendMessage);
router.get("/receive/:receiverId", protectedRoute, getMessages);

export default router;
