import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../controllers/orderController.js";
import { authenticate, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// GET routes
router.get("/", requirePermission("orders:read"), getAllOrders);
router.get("/:id", requirePermission("orders:read"), getOrderById);

// POST route
router.post("/", requirePermission("orders:create"), createOrder);

// PUT route - full order update (edit customer, items, status, etc.)
router.put("/:id", requirePermission("orders:update"), updateOrder);

export default router;