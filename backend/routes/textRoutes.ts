const textController = require("../controllers/textController")
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect");
// Protect all routes after this middleware
router.use(protect);

router.get("/", textController.getText);

module.exports = router;
