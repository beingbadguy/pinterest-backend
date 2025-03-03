import { getReceiverSocketId, io } from "../config/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  const receiverId = req.params.receiverId.toString();
  const senderId = req.user._id.toString();
  const { text } = req.body;

  // TODO: add image send facility
  try {
    if (!receiverId) {
      res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }
    if (!text) {
      res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }
    const message = new Message({
      senderId: senderId,
      receiverId: receiverId,
      text,
    });
    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    // console.log(receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      message,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while sending message",
    });
  }
};

export const getMessages = async (req, res) => {
  const receiverId = req.params.receiverId;
  const senderId = req.user._id;
  try {
    if (!receiverId) {
      res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .populate("senderId", "-password")
      .populate("receiverId", "-password");

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching messages",
    });
  }
};
