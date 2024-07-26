const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");
const { validateUser } = require("../middlewares/validation");
const protect = require("../middlewares/protect");

router.post("/login", authController.login);
router.post("/signup", validateUser, authController.signup);

// Protect all routes after this middleware
router.use(protect);

router.delete("/deleteMe", userController.deleteMe);

// Only admin have permission to access for the below APIs
// router.use(authController.restrictTo("admin"));

router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
