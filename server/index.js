import dotenv from "dotenv";
dotenv.config();
import express from "express";
// import path from "path";
import cookieParser from "cookie-parser";
import dbConnect from "./config/dbConnection.js";
import cloudinaryConnection from "./config/cloudinary.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import { app, server, io } from "./config/socket.js";
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  })
);
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 8080;
// const __dirname = path.resolve();

// api routes
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import messageRoutes from "./routes/message.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/message", messageRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
//   });
// }
// server starts from here

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

server.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
  dbConnect();
  cloudinaryConnection();
});
