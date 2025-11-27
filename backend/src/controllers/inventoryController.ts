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

// Helper function to calculate item status
const calculateStatus = (quantity: number, threshold: number, expiry_date?: Date): string => {
  // Check if expired first (highest priority)
  if (expiry_date) {
    const now = new Date();
    const expiryDate = new Date(expiry_date);

    // Set time to midnight for accurate date comparison
    now.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    if (expiryDate <= now) {
      return "Expired";
    }
  }

  // Check if out of stock (second priority)
  if (quantity === 0) {
    return "Out of Stock";
  }

  // Check if low stock (third priority)
  if (quantity <= threshold) {
    return "Low Stock";
  }

  // Default status
  return "In Stock";
};

// Get all inventory items
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Inventory.find();

    // Recalculate status for each item to ensure accuracy
    const updatedItems = items.map(item => {
      const calculatedStatus = calculateStatus(item.quantity, item.threshold, item.expiry_date);

      // If status changed, update the item in database
      if (item.status !== calculatedStatus) {
        item.status = calculatedStatus;
        item.save(); // Save asynchronously without waiting
      }

      return item;
    });

    res.json(updatedItems);
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

// Get alerts for low stock and expiring items
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const items = await Inventory.find();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Calculate alerts for each item
    const alerts = items
      .map(item => {
        const calculatedStatus = calculateStatus(item.quantity, item.threshold, item.expiry_date);

        // Update status if changed
        if (item.status !== calculatedStatus) {
          item.status = calculatedStatus;
          item.save();
        }

        let severity: 'critical' | 'warning' | 'low-stock' | 'out-of-stock' | null = null;
        let daysLeft = 0;
        let alertType: 'expired' | 'expiring-soon' | 'expiring' | 'low-stock' | 'out-of-stock' | null = null;

        // Check expiry status
        if (item.expiry_date) {
          const expiryDate = new Date(item.expiry_date);
          expiryDate.setHours(0, 0, 0, 0);

          daysLeft = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          if (daysLeft < 0) {
            severity = 'critical';
            alertType = 'expired';
          } else if (daysLeft <= 7) {
            severity = 'critical';
            alertType = 'expiring-soon';
          } else if (daysLeft <= 30) {
            severity = 'warning';
            alertType = 'expiring';
          }
        }

        // Check stock levels (if not already flagged for expiry)
        if (!alertType) {
          if (item.quantity === 0) {
            severity = 'out-of-stock';
            alertType = 'out-of-stock';
          } else if (item.quantity <= item.threshold) {
            severity = 'low-stock';
            alertType = 'low-stock';
          }
        }

        // Only return items that have alerts
        if (severity && alertType) {
          return {
            _id: item._id,
            item_name: item.item_name,
            barcode: item.barcode,
            category: item.category,
            quantity: item.quantity,
            threshold: item.threshold,
            expiry_date: item.expiry_date,
            status: item.status,
            severity,
            alertType,
            daysLeft,
          };
        }

        return null;
      })
      .filter(alert => alert !== null);

    // Sort by severity (out-of-stock and critical first) and then by days left
    alerts.sort((a, b) => {
      // Out of stock has highest priority
      if (a!.severity === 'out-of-stock' && b!.severity !== 'out-of-stock') return -1;
      if (a!.severity !== 'out-of-stock' && b!.severity === 'out-of-stock') return 1;

      // Then critical
      if (a!.severity === 'critical' && b!.severity !== 'critical') return -1;
      if (a!.severity !== 'critical' && b!.severity === 'critical') return 1;

      // Expired items come before expiring
      if (a!.alertType === 'expired') return -1;
      if (b!.alertType === 'expired') return 1;

      return a!.daysLeft - b!.daysLeft;
    });

    // Calculate statistics
    const stats = {
      total: alerts.length,
      critical: alerts.filter(a => a!.severity === 'critical').length,
      warning: alerts.filter(a => a!.severity === 'warning').length,
      lowStock: alerts.filter(a => a!.severity === 'low-stock').length,
      outOfStock: alerts.filter(a => a!.severity === 'out-of-stock').length,
      expired: alerts.filter(a => a!.alertType === 'expired').length,
      expiringSoon: alerts.filter(a => a!.alertType === 'expiring-soon').length,
      expiring: alerts.filter(a => a!.alertType === 'expiring').length,
    };

    res.json({ alerts, stats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
