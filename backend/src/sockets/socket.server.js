const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const {
  aiGenerateContent,
  aiGenerateVectors,
} = require("../services/ai.service");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const {
  querySimilarChatVectors,
  upsertChatMessageVector,
} = require("../services/vectorDB.service");

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
      const { chat, content } = messagePayload;
      console.log("User: ", messagePayload);
      console.log("chat and content", chat, content);

      if (!chat || !content) {
        return socket.emit("error", { message: "Invalid message payload" });
      }

      // user message save into db
      const userMsg = await new Message({
        user: socket.user._id,
        chat: chat,
        role: "user",
        content: content,
      }).save();

      // generate vectors for user message and get recent messages
      const [vectors, recentMessage] = await Promise.all([
        // generate vectors embedding
        aiGenerateVectors(content),

        // get recent messages
        Message.find({ chat: chat }).sort({ createdAt: -1 }).limit(10).lean(),
      ]);

      console.log("Recent messages", recentMessage);

      // query similar chats data (vector database)
      const similarChatsMessages = await querySimilarChatVectors({
        queryVectors: vectors,
        limit: 3,
        metadata: {},
      });

      console.log("Similar chats messages", similarChatsMessages);

      // create chat history
      const chatHistory = recentMessage.reverse().map((msg) => {
        return {
          role: msg.role,
          parts: [{ text: msg.content }],
        };
      });

      // vector database memory
      const longTermMemoryData = [
        {
          role: "user",
          parts: [
            {
              text: `
              These are some previous chat message used them to generate a response
              ${similarChatsMessages
                .map((item) => item.metadata.text)
                .join("\n")}
              `,
            },
          ],
        },
      ];

      console.log("chat history", ...chatHistory);
      console.log("long term memory", longTermMemoryData[0]);

      // ai generate response
      const aiResponse = await aiGenerateContent([
        ...longTermMemoryData,
        ...chatHistory,
      ]);
      console.log("AI: ", aiResponse);

      // fire event (Send the ai generate response to client)
      socket.emit("ai-message-response", {
        chat: chat,
        content: aiResponse,
      });

      //message's response save into db
      const aiMsg = await new Message({
        user: socket.user._id,
        chat: chat,
        role: "model",
        content: aiResponse,
      }).save();

      (async () => {
        try {
          await Promise.all([
            // insert user message's vectors into vectorDB
            upsertChatMessageVector({
              vectors: vectors,
              messageId: userMsg._id,
              metadata: {
                chat: chat,
                user: socket.user._id,
                text: content,
              },
            }),

            // Generate ai response to vectors
            (async () => {
              // generate vectors embedding (ai response)
              const responseVectors = await aiGenerateVectors(aiResponse);

              // insert ai message's vector into vectorDB
              await upsertChatMessageVector({
                vectors: responseVectors,
                messageId: aiMsg._id,
                metadata: {
                  chat: chat,
                  user: socket.user._id,
                  text: aiResponse,
                },
              });
            })(),
          ]);
        } catch (err) {
          console.error("Background vector insert error:", err);
        }
      })();
    });
  });
};

module.exports = setupSocketIoServer;
