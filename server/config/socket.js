import { Server } from "socket.io";
import express from "express";
import http from "http";
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export const getReceiverSocketId = (userId) => {
  return socketMap[userId];
};

const socketMap = {};
console.log(socketMap);

io.on("connection", (socket) => {
  console.log("A user has been connected to the server", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    socketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(socketMap));

  socket.on("typing", ({ senderId, receiverId }) => {
    console.log(socketMap);
    const receiverSocketId = socketMap[receiverId];

    // console.log(receiverSocketId, "socket id of receiver connected");
    console.log(receiverSocketId, "this is receiver socket id");

    console.log(senderId, receiverId);
    console.log(receiverSocketId, "socket id of receiver connected");
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        senderId,
        typing: true,
      });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = socketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        senderId,
        typing: false,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected from the server", socket.id);
    if (userId && socketMap[userId] === socket.id) {
      delete socketMap[userId];
      io.emit("getOnlineUsers", Object.keys(socketMap)); // Broadcast updated online users
    }
    io.emit("getOnlineUsers", Object.keys(socketMap));
  });
  // socket.removeAllListeners();
});

export { app, server, io };
