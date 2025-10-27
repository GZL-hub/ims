import express from "express";
import {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getAllItems);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
