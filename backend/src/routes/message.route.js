const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();
const { getAllMessages } = require("../controllers/message.controller");

router.get("/:id", authMiddleware, getAllMessages);

module.exports = router;
