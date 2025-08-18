require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const { connectDB } = require("./src/db/db");
const setupSocketIoServer = require("./src/sockets/socket.server");

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

// connect to the database
connectDB();

// call socket io setup function
setupSocketIoServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
