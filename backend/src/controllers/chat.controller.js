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

module.exports = { createChatController };
