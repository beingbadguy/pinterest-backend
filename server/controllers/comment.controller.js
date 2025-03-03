import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const createComment = async (req, res) => {
  const { text } = req.body;
  const postId = req.params.postId;
  const user = req.user._id;
  try {
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }
    const post = await Post.findById(postId);
    const newComment = new Comment({
      text,
      user: user,
      post: postId,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.json({
      success: true,
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error creating comment",
    });
  }
};

export const getCommentsOnPost = async (req, res) => {};

export const deleteCommentOnPost = async (req, res) => {};
