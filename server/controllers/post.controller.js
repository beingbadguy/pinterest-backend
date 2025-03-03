import Post from "../models/post.model.js";
import cloudinary from "cloudinary";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
  const { title, description } = req.body;
  const image = req?.files?.image;
  //   console.log(title, description, image);
  try {
    if (!title || !description) {
      return res.status(404).json({
        success: false,
        message: "Title and description are required",
      });
    }
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image is required",
      });
    }
    const newImage = await cloudinary.v2.uploader.upload(image.tempFilePath, {
      public_id: `pinterest-clone/${image.filename}`,
    });

    const newPost = new Post({
      title,
      description,
      imageUrl: newImage.secure_url,
      user: req.user._id,
    });
    await newPost.save();
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { posts: newPost._id } },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while creating post",
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching posts",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching post",
    });
  }
};

export const updatePost = async (req, res) => {
  const { title, description } = req.body;
  const postId = req.params.id;
  try {
    if (!title && !description) {
      return res.status(404).json({
        success: false,
        message: "Title and description are required",
      });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while updating post",
    });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { posts: req.params.id } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while deleting post",
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  try {
    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    post = await (await post.save()).populate("user");
    // (await post.save()).populate("user");
    res.status(200).json({
      success: true,
      message: "Post liked/unliked successfully",
      post,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: "Error while liking/unliking post",
    });
  }
};

export const getFollowedUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Login User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Saare Followed User Ids
    const followedUsers = user.following;

    // Posts Find
    const posts = await Post.find({ user: { $in: followedUsers } })
      .populate("user", "username profilePic") // Optional (user details lana ho to)
      .sort({ createdAt: -1 }); // Latest Post First

    res.status(200).json({
      success: true,
      message: "Followed users' posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching posts",
    });
  }
};

export const commentOnPost = async (req, res) => {};

export const getCommentsOnPost = async (req, res) => {};

export const deleteCommentOnPost = async (req, res) => {};
