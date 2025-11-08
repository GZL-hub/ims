import { Request, Response } from "express";
import Inventory from "../models/inventoryModel.js";
import fs from "fs";
import path from "path";

// Helper function to delete image file
const deleteImageFile = (imagePath: string | undefined) => {
  if (imagePath) {
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// Create a new inventory item
export const createItem = async (req: Request, res: Response) => {
  try {
    const itemData = { ...req.body };

    // If file was uploaded, store the path
    if (req.file) {
      itemData.image = `uploads/items/${req.file.filename}`;
    }

    const item = new Inventory(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (err: any) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      deleteImageFile(`uploads/items/${req.file.filename}`);
    }
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
    const itemData = { ...req.body };

    // Find existing item to get old image path
    const existingItem = await Inventory.findById(req.params.id);
    if (!existingItem) {
      // If item not found and file was uploaded, delete the new file
      if (req.file) {
        deleteImageFile(`uploads/items/${req.file.filename}`);
      }
      return res.status(404).json({ message: "Item not found" });
    }

    // If new file was uploaded
    if (req.file) {
      // Delete old image if it exists
      if (existingItem.image) {
        deleteImageFile(existingItem.image);
      }
      // Set new image path
      itemData.image = `uploads/items/${req.file.filename}`;
    }

    // Update last_updated timestamp
    itemData.last_updated = new Date();

    const updated = await Inventory.findByIdAndUpdate(req.params.id, itemData, { new: true });
    res.json(updated);
  } catch (err: any) {
    // If there was an error and a new file was uploaded, delete it
    if (req.file) {
      deleteImageFile(`uploads/items/${req.file.filename}`);
    }
    res.status(400).json({ error: err.message });
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete associated image file if it exists
    if (item.image) {
      deleteImageFile(item.image);
    }

    await Inventory.findByIdAndDelete(req.params.id);
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
