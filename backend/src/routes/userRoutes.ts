import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
} from "../controllers/userController.js";
import {
  authenticate,
  requirePermission,
  requireRole,
} from "../middleware/authMiddleware.js";
import { UserRole } from "../models/userModel.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users - requires 'user:read' permission
router.get("/", requirePermission("user:read"), getAllUsers);

// Get single user - requires 'user:read' permission
router.get("/:id", requirePermission("user:read"), getUserById);

// Update user - requires 'user:update' permission
router.put("/:id", requirePermission("user:update"), updateUser);

// Delete user - requires 'user:delete' permission (admin only)
router.delete("/:id", requirePermission("user:delete"), deleteUser);

// Deactivate user - requires admin role
router.patch("/:id/deactivate", requireRole(UserRole.ADMIN), deactivateUser);

// Activate user - requires admin role
router.patch("/:id/activate", requireRole(UserRole.ADMIN), activateUser);

export default router;
