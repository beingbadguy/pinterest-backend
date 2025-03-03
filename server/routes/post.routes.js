import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  createPost,
  deletePostById,
  getFollowedUserPosts,
  getPostById,
  getPosts,
  likeUnlikePost,
  updatePost,
} from "../controllers/post.controller.js";
const router = new Router();

// Import routes
router.post("/create-post", protectedRoute, createPost);
router.get("/get-all-posts", protectedRoute, getPosts);
router.get("/get/:id", protectedRoute, getPostById);
router.delete("/delete/:id", protectedRoute, deletePostById);
router.post("/like-unlike/:id", protectedRoute, likeUnlikePost);
router.put("/update/:id", protectedRoute, updatePost);
router.get("/getfollowedposts", protectedRoute, getFollowedUserPosts);

export default router;
