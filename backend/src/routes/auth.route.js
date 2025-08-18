const {
  postRegisterController,
  postLoginController,
} = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.route("/register").post(postRegisterController);

router.route("/login").post(postLoginController);

module.exports = router;
