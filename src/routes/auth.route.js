const {
  getRegisterController,
  getLoginController,
} = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.route("/register").get(getRegisterController);

router.route("/login").get(getLoginController);

module.exports = router;
