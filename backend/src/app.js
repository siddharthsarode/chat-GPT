const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// Routers
const authRoutes = require("./routes/auth.route");
const chatRoutes = require("./routes/chat.route");
const messageRoutes = require("./routes/message.route");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Third party middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

// routers use
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chat/messages", messageRoutes);

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
