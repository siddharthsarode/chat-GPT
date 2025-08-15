const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const { authMiddleware } = require("./middleware/auth.middleware");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", authMiddleware, (req, res) => {
  res.render("index", { title: "Home" });
});

module.exports = app;
