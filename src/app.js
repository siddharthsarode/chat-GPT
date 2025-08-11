const express = require("express");
const path = require("path");
const authRoutes = require("./routes/auth.route");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

module.exports = app;
