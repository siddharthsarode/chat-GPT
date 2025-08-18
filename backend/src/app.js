const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.route");
const { authMiddleware } = require("./middleware/auth.middleware");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Third party middlewares
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", authMiddleware, (req, res) => {
  res.render("index", { title: "Home" });
});

module.exports = app;
