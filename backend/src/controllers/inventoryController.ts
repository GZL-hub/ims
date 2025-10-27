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

// Search inventory items by barcode or item name
export const searchItems = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Search by barcode or item name (case-insensitive, partial match)
    const items = await Inventory.find({
      $or: [
        { barcode: { $regex: query, $options: 'i' } },
        { item_name: { $regex: query, $options: 'i' } }
      ]
    }).limit(10); // Limit to 10 results for autocomplete

    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get item by barcode
export const getItemByBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;
    const item = await Inventory.findOne({ barcode });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
