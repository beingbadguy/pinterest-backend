import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default:
        "https://img.icons8.com/?size=100&id=84861&format=png&color=000000",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bio: {
      type: String,
      default: "",
    },
    accountVerificationToken: {
      type: String,
      default: null,
    },
    accountVerificationTokenExpiresIn: {
      type: Date,
      default: null,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    forgetPasswordToken: {
      type: String,
      default: null,
    },
    forgetPasswordTokenExpiresIn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
