import User from "../models/user.model.js";
import cloudinary from "cloudinary";

export const uploadProfilePicture = async (req, res) => {
  const image = req?.files?.image;
  try {
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }
    const imageUrl = await cloudinary.v2.uploader.upload(image.tempFilePath, {
      public_id: `pinterest-clone/${image.name}}`,
    });
    console.log(imageUrl.secure_url);

    const user = await User.findById(req.user._id);
    user.profilePic = imageUrl.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while uploading profile picture",
    });
  }
};
export const updateUserName = async (req, res) => {
  const name = req.body.name;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "No name provided",
      });
    }
    const user = await User.findById(req.user._id);
    user.name = name;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while updating username",
    });
  }
};

export const getAllUsers = async (req, res) => {
  const userId = req.user._id;
  try {
    const users = await User.find({ _id: { $ne: userId } }, "-password");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching users",
    });
  }
};
export const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user",
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  const userId = req.user._id;
  const targetUserId = req.params.id;
  try {
    if (userId.toString() === targetUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot follow yourself",
      });
    }
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.following.includes(targetUserId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
    }
    await user.save();
    await targetUser.save();
    res.status(200).json({
      success: true,
      message: "User followed/unfollowed successfully",
      user,
      targetUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while following/unfollowing user",
    });
  }
};


