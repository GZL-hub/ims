import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  changePassword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Protected routes (authentication required)
router.get("/me", authenticate, getCurrentUser);
router.put("/change-password", authenticate, changePassword);

export default router;
