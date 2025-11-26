import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { authenticate, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// GET routes - require 'orders:read' permission
router.get("/", requirePermission("orders:read"), getAllOrders);
router.get("/:id", requirePermission("orders:read"), getOrderById);

// POST route - require 'orders:create' permission
router.post("/", requirePermission("orders:create"), createOrder);

// PUT route - require 'orders:update' permission
router.put("/:id", requirePermission("orders:update"), updateOrderStatus);

// DELETE route - require 'orders:delete' permission
router.delete("/:id", requirePermission("orders:delete"), deleteOrder);

export default router;