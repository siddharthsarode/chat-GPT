const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();
const {
  createChatController,
  getAllChatsController,
} = require("../controllers/chat.controller");

router.post("/", authMiddleware, createChatController);
router.get("/", authMiddleware, getAllChatsController);

module.exports = router;
