import express from "express";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  searchItems,
  getItemByBarcode,
  getAlerts,
} from "../controllers/inventoryController.js";
import { authenticate, requirePermission } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All inventory routes require authentication
router.use(authenticate);

// GET routes - require 'inventory:read' permission
router.get("/", requirePermission("inventory:read"), getAllItems);
router.get("/alerts", requirePermission("inventory:read"), getAlerts);
router.get("/search", requirePermission("inventory:read"), searchItems);
router.get("/barcode/:barcode", requirePermission("inventory:read"), getItemByBarcode);

// POST routes - require 'inventory:create' permission
// upload.single('image') handles single file upload with field name 'image'
router.post("/", requirePermission("inventory:create"), upload.single('image'), createItem);

// PUT routes - require 'inventory:update' permission
// upload.single('image') handles single file upload with field name 'image'
router.put("/:id", requirePermission("inventory:update"), upload.single('image'), updateItem);

// DELETE routes - require 'inventory:delete' permission
router.delete("/:id", requirePermission("inventory:delete"), deleteItem);

export default router;
