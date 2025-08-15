const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// Register controller
const getRegisterController = (req, res) => {
  res.render("./auth/register", { title: "Register" });
};

const postRegisterController = async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.render("./auth/register", { error: "All fields are required." });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render("./auth/register", { error: "Invalid email format." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (existingUser) {
      return res.render("./auth/register", {
        error: "Email already registered.",
      });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("./auth/register", {
      error: err.message || "Something went wrong",
    });
  }
};

// login controller
const getLoginController = (req, res) => {
  res.render("./auth/login", { title: "Login" });
};

const postLoginController = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.render("./auth/login", { error: "All fields are required." });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
    if (!user) {
      return res.render("./auth/login", { error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("./auth/login", { error: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("./auth/login", { error: "Server error." + err.message });
  }
};

const getLogoutController = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};

module.exports = {
  getRegisterController,
  getLoginController,
  getLogoutController,
  postRegisterController,
  postLoginController,
};
