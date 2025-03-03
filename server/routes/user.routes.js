import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  followUnfollowUser,
  getAllUsers,
  getSingleUser,
  updateUserName,
  uploadProfilePicture,
} from "../controllers/user.controller.js";

const router = new Router();
router.get("/allusers", protectedRoute, getAllUsers);
router.get("/user/:id", protectedRoute, getSingleUser);
router.put("/update-profile-picture", protectedRoute, uploadProfilePicture);
router.put("/update-name", protectedRoute, updateUserName);
router.post("/followunfollowuser/:id", protectedRoute, followUnfollowUser);

export default router;
