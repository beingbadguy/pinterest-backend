import jwt from "jsonwebtoken";

const setCookieAndGenerateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("Pinterest", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",

    secure: process.env.NODE_ENV === "production", // Cookie secure only if in production environment
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return token;
};

export default setCookieAndGenerateToken;
