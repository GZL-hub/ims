import { Request, Response } from "express";
import Inventory from "../models/inventoryModel.js";

// Create a new inventory item
export const createItem = async (req: Request, res: Response) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Get all inventory items
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update an item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
