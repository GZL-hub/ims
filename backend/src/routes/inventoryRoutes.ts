import express from "express";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  searchItems,
  getItemByBarcode,
} from "../controllers/inventoryController.js";
import { authenticate, requirePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// All inventory routes require authentication
router.use(authenticate);

// GET routes - require 'inventory:read' permission
router.get("/", requirePermission("inventory:read"), getAllItems);
router.get("/search", requirePermission("inventory:read"), searchItems);
router.get("/barcode/:barcode", requirePermission("inventory:read"), getItemByBarcode);

// POST routes - require 'inventory:create' permission
router.post("/", requirePermission("inventory:create"), createItem);

// PUT routes - require 'inventory:update' permission
router.put("/:id", requirePermission("inventory:update"), updateItem);

// DELETE routes - require 'inventory:delete' permission
router.delete("/:id", requirePermission("inventory:delete"), deleteItem);

export default router;
