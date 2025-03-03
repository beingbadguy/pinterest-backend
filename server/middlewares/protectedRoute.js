import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const protectedRoute = async (req, res, next) => {
  const token = req.cookies.Pinterest;
  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }
};

export default protectedRoute;
