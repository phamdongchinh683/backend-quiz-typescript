const express = require("express");
const router = express.Router();
const authController = require("../../controllers/Auth/auth.controllers");
const authMiddleware = require("../../controllers/Auth/auth.middlewares");

router.post("/signup", authMiddleware.inputSignup, authController.signup);
router.post("/login", authMiddleware.isStudent, authController.login);
router.post(
  "/refresh",
  authMiddleware.authorization,
  authController.refreshToken
);

module.exports = router;
