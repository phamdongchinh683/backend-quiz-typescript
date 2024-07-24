const express = require("express");
const router = express.Router();
const authMiddleware = require("../../controllers/Auth/auth.middlewares");
const authController = require("../../controllers/Auth/auth.controllers");

router.get(
  "/profile",
  authMiddleware.authorization,
  authMiddleware.roleStudent,
  authController.viewProfile
);

router.post(
  "/profile/change-password",
  authMiddleware.authorization,
  authMiddleware.roleStudent,
  authController.updatePassword
);

router.post(
  "/profile/change-information",
  authMiddleware.authorization,
  authMiddleware.roleStudent,
  authController.updateProfile
);

router.get(
  "/profile/exam-history",
  authMiddleware.authorization,
  authMiddleware.roleStudent,
  authController.examHistory
);

router.get(
  "/exam-list",
  authMiddleware.authorization,
  authMiddleware.roleStudent,
  authController.listExam
);

router.post(
  "/take-exam/:id",
  authMiddleware.authorization,
  authMiddleware.roleStudent,
  authController.getExam
);
router.post(
  "/submit-exam/:id",
  authMiddleware.authorization,
  authMiddleware.roleStudent,
  authMiddleware.submitResults,
  authMiddleware.examResult,
  authController.saveResult
);

module.exports = router;
