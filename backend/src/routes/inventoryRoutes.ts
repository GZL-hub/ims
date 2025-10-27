import express from "express";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  searchItems,
  getItemByBarcode,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getAllItems);
router.get("/search", searchItems);
router.get("/barcode/:barcode", getItemByBarcode);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
