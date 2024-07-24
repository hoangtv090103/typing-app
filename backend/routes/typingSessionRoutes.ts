const sessionController = require("../controllers/typingSessionController");
const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

// Protect all routes after this middleware
router.use(authController.protect);

router.post("/", sessionController.createTypingSession);
router.get("/", sessionController.getUserTypingSessions);
router.get("/:id", sessionController.getTypingSessionById);

module.exports = router;
