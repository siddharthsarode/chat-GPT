const { Server } = require("socket.io");

const setupSocketIoServer = (httpServer) => {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    console.log("A user connected");
  });
};

module.exports = setupSocketIoServer;
