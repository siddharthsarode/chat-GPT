const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const {
  aiGenerateContent,
  aiGenerateVectors,
} = require("../services/ai.service");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const { insertVectors } = require("../services/vectorDB.service");

const setupSocketIoServer = async (httpServer) => {
  const io = new Server(httpServer, {});

  // Middlewares

  // check user is logged in or not
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.gpt_token) {
      next(new Error("Unauthorized User: No token provided"));
    }

    try {
      const decode = jwt.verify(cookies.gpt_token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error(err.message || "Unauthorized User"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("A user connected", socket.id, socket.user.username);

    // Listen client event
    socket.on("message", async (messagePayload) => {
      console.log("User: ", messagePayload);

      // message save into db
      const msg = new Message({
        user: socket.user._id,
        chat: messagePayload.chat,
        role: "user",
        content: messagePayload.content,
      });
      const msgRes = await msg.save();

      // ***** PINECONE Database insert (start) *****

      // generate vectors embedding
      const vectors = await aiGenerateVectors(messagePayload.content);

      // insert vector into vectorDB
      await insertVectors({
        vectors: vectors,
        messageId: msgRes._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      // ***** PINECONE Database insert (end) *****

      // Short term memory logic
      const messages = (
        await Message.find({ chat: messagePayload.chat })
          .sort({ createAt: -1 })
          .limit(10)
          .lean()
      ).reverse();

      const chatHistory = messages.map((msg) => {
        return {
          role: msg.role,
          parts: [{ text: msg.content }],
        };
      });

      // console.log("chat history", chatHistory);

      // ai generate response
      const aiResponse = await aiGenerateContent(chatHistory);
      console.log("AI: ", aiResponse);

      //message's response save into db
      const aiMsg = new Message({
        user: socket.user._id,
        chat: messagePayload.chat,
        role: "model",
        content: aiResponse,
      });
      const resMsg = await aiMsg.save();

      // ***** PINECONE Database insert (start) *****

      // generate vectors embedding
      const responseVectors = await aiGenerateVectors(aiResponse);

      // insert vector into vectorDB
      await insertVectors({
        vectors: responseVectors,
        messageId: resMsg._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: aiResponse,
        },
      });

      // ***** PINECONE Database insert (end) *****

      // fire event (Send the ai generate response to client)
      socket.emit("ai-message-response", {
        chat: messagePayload.chat,
        content: aiResponse,
      });
    });
  });
};

module.exports = setupSocketIoServer;
