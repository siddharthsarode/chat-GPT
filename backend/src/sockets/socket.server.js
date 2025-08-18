const { Server } = require("socket.io");
const { aiGenerateContent } = require("../services/ai.service");

const setupSocketIoServer = async (httpServer) => {
  const io = new Server(httpServer, {});

  io.on("connection", async (socket) => {
    console.log("A user connected");

    socket.on("message", async (message) => {
      console.log("User: ", message);

      const aiResponse = await aiGenerateContent(message);
      console.log("AI: ", aiResponse);

      socket.emit("ai-message-response", aiResponse);
    });
  });
};

module.exports = setupSocketIoServer;
