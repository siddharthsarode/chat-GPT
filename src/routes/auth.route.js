const {
  getRegisterController,
  getLoginController,
  postRegisterController,
  postLoginController,
  getLogoutController,
} = require("../controllers/auth.controller");
const express = require("express");
const { redirectIfAuthenticated } = require("../middleware/auth.middleware");
const router = express.Router();

router
  .route("/register")
  .get(redirectIfAuthenticated, getRegisterController)
  .post(postRegisterController);

router
  .route("/login")
  .get(redirectIfAuthenticated, getLoginController)
  .post(postLoginController);

router.route("/logout").get(getLogoutController);

module.exports = router;
