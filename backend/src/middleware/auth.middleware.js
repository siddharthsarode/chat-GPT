const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.gpt_token;

    if (!token) return res.status(401).json({ message: "You must be login." });

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);

    if (!user) return res.redirect("./auth/login");

    req.user = user;
    next();
  } catch (err) {
    console.log("auth middleware error", err);
    res.status(401).json({ message: err.message || "You must be login." });
  }
};

module.exports = { authMiddleware };
