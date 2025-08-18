const express = require("express");
const { createChatController } = require("../controllers/chat.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware, createChatController);

module.exports = router;
