const Message = require("../models/message.model");

const getAllMessages = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "chatId is required" });
    }
    const messages = await Message.find({ chat: id });

    res.status(200).json({
      data: messages,
      success: true,
      message: "All messages fetch by chat id",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

module.exports = { getAllMessages };
