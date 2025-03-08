import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import setCookieAndGenerateToken from "../utils/setCookieAndGenerateToken.js";
import {
  forgetPasswordMail,
  loginMail,
  passwordChangedMail,
  verificationMail,
} from "../services/mail.service.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const emailRegex = /^[\w.-]+@[a-zA-Z\d-]+(\.[a-zA-Z]{2,})+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    const userAlreadyExists = await User.findOne({ email: email });
    const usernameAlreadyExists = await User.findOne({ username: username });
    if (usernameAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: " Username already exists",
      });
    }
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(Math.random() * 900000 + 100000);
    const accountVerificationTokenExpiresIn = Date.now() + 60 * 60 * 1000;
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      accountVerificationToken: verificationToken,
      accountVerificationTokenExpiresIn,
    });
    await newUser.save();
    await setCookieAndGenerateToken(res, newUser._id);
    verificationMail(email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Problem while registering user",
    });
  }
};

export const sendVerificationMail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const verificationToken = Math.floor(Math.random() * 900000 + 100000);
    user.accountVerificationToken = verificationToken;
    user.accountVerificationTokenExpiresIn = Date.now() + 60 * 60 * 1000;
    await user.save();
    verificationMail(email, verificationToken);
    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Problem while sending verification email",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    await setCookieAndGenerateToken(res, user._id);
    loginMail(email);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Problem while logging in",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("Pinterest", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Problem while logging out",
    });
  }
};

export const userVerify = async (req, res) => {
  const { verificationToken } = req.body;

  try {
    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }
    const user = await User.findOne({
      accountVerificationToken: verificationToken,
      accountVerificationTokenExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token or token expired",
      });
    }

    user.isAccountVerified = true;
    user.accountVerificationToken = null;
    user.accountVerificationTokenExpiresIn = null;
    await user.save();
    await setCookieAndGenerateToken(res, user._id);
    UserVerifiedMail(user.email);
    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Problem while verifying account",
    });
  }
};

export const forgetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials. Please try again",
      });
    }
    const forgetPasswordToken = crypto.randomBytes(32).toString("hex");
    const forgetPasswordTokenExpiresIn = Date.now() + 10 * 60 * 1000; // 1 hour

    user.forgetPasswordToken = forgetPasswordToken;
    user.forgetPasswordTokenExpiresIn = forgetPasswordTokenExpiresIn;
    await user.save();
    forgetPasswordMail(email, forgetPasswordToken);
    res.status(200).json({
      success: true,
      message: "Reset password link has been sent to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Problem while sending reset password email",
    });
  }
};

export const changePassword = async (req, res) => {
  const { password } = req.body;
  const { query } = req.params;
  try {
    if (!password || !query) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({
      forgetPasswordToken: query,
      forgetPasswordTokenExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials. Please try again",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.forgetPasswordToken = null;
    user.forgetPasswordTokenExpiresIn = null;
    await user.save();
    passwordChangedMail(user.email);
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Problem while changing password",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Problem while getting user information",
    });
  }
};
