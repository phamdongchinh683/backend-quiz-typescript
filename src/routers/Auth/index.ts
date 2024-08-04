import express, { Router } from "express";
const router: Router = express.Router();

import authMiddleware from "../../middlewares/Auth/authMiddleware";
import authController from "../../controllers/Auth/auth.controllers";

// router.post("/signup", authMiddleware.signUpData, authController.signup);
router.post("/login", authMiddleware.isStudent,authController.login);
router.post(
  "/refresh",
  authMiddleware.authorization,
  authController.refreshToken
);

router.get(
    "/profile",
    authMiddleware.authorization,
    authMiddleware.roleStudent,
    authController.profileView
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
  
//   router.get(
//     "/exam-list",
//     authMiddleware.authorization,
//     authMiddleware.roleStudent,
//     authController.listExam
//   );
  
//   router.post(
//     "/take-exam/:id",
//     authMiddleware.authorization,
//     authMiddleware.roleStudent,
//     authController.getExam
//   );
//   router.post(
//     "/submit-exam/:id",
//     authMiddleware.authorization,
//     authMiddleware.roleStudent,
//     authMiddleware.submitResults,
//     authMiddleware.examResult,
//     authController.saveResult
//   );

export default router;