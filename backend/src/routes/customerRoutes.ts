import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";
import { authenticate, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// All customer routes require authentication
router.use(authenticate);

// GET routes
router.get("/", requirePermission("customer:read"), getAllCustomers);
router.get("/:id", requirePermission("customer:read"), getCustomerById);

// POST route
router.post("/", requirePermission("customer:create"), createCustomer);

// PUT route
router.put("/:id", requirePermission("customer:update"), updateCustomer);

// DELETE route
router.delete("/:id", requirePermission("customer:delete"), deleteCustomer);

export default router;
