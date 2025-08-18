const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Routers
const authRoutes = require("./routes/auth.route");
const chatRoutes = require("./routes/chat.route");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Third party middlewares
app.use(cookieParser());
app.use(morgan("dev"));

// routers use
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.json({ title: "Home" });
});

module.exports = app;
