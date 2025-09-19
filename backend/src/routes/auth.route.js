const {
  postRegisterController,
  postLoginController,
  getUserController,
  logoutController,
} = require("../controllers/auth.controller");
const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.route("/register").post(postRegisterController);

router.route("/login").post(postLoginController);
router.route("/logout").get(authMiddleware, logoutController);
router.route("/me").get(authMiddleware, getUserController);

module.exports = router;
