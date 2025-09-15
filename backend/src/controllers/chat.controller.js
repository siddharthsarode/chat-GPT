const Chat = require("../models/chat.model");

const createChatController = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is require" });

    const user = req.user;
    const chat = new Chat({
      title,
      user: user._id,
    });
    await chat.save();
    res.status(201).json({ message: "Chat created successfully", chat });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

//get chats
const getAllChatsController = async (req, res) => {
  try {
    const user = req.user;
    const chats = await Chat.find({ user: user._id });

    if (!chats || chats.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found", success: false });
    }

    res.status(200).json({
      data: chats,
      success: true,
      message: "Chats fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

module.exports = { createChatController, getAllChatsController };
