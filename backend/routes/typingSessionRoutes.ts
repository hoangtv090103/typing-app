const {
  createTypingSession,
  getTypingSessionById,
  getUserTypingSessions,
} = require("../controllers/typingSessionController");
const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

// Protect all routes after this middleware
router.use(authController.protect);

router.post("/", createTypingSession);
router.get("/", getUserTypingSessions);
router.get("/:id", getTypingSessionById);

module.exports = router;
