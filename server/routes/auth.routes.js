import { Router } from "express";
import {
  changePassword,
  forgetPasswordRequest,
  getMe,
  login,
  logout,
  sendVerificationMail,
  signup,
  userVerify,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middlewares/protectedRoute.js";
const router = new Router();
router.get("/me", protectedRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/verification-code", sendVerificationMail);
router.post("/verify", userVerify);
router.post("/logout", logout);
router.post("/forget", forgetPasswordRequest);
router.post("/forget-password/:query", changePassword);

export default router;
