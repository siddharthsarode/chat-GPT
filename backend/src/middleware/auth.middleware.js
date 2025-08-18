const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) return res.redirect("./auth/login");

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id).select("-password");

    if (!user) return res.redirect("./auth/login");

    req.user = user;
    next();
  } catch (err) {
    console.log("auth middleware error", err);
    res.redirect("./auth/login");
  }
};

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect("/");
  } catch (err) {
    return next();
  }
};

module.exports = { authMiddleware, redirectIfAuthenticated };
