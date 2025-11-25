import { Request, Response } from "express";
import Order from "../models/orderModel.js";
import Inventory from "../models/inventoryModel.js";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_name, items } = req.body;

    if (!customer_name || !items || !items.length) {
      return res.status(400).json({ message: "Customer name and items are required" });
    }

    // Check inventory and deduct quantities
    for (const orderItem of items) {
      const inventoryItem = await Inventory.findById(orderItem.inventoryId);
      if (!inventoryItem) {
        return res.status(404).json({ message: `Inventory item not found: ${orderItem.item_name}` });
      }
      if (inventoryItem.quantity < orderItem.quantity) {
        return res.status(400).json({ message: `Not enough stock for item: ${orderItem.item_name}` });
      }

      inventoryItem.quantity -= orderItem.quantity;
      await inventoryItem.save();
    }

    const order = new Order({ customer_name, items });
    await order.save();

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ date_created: -1 });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.inventoryId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, last_updated: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete order (optional: restore inventory quantities)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Restore inventory if needed
    for (const item of order.items) {
      const inventoryItem = await Inventory.findById(item.inventoryId);
      if (inventoryItem) {
        inventoryItem.quantity += item.quantity;
        await inventoryItem.save();
      }
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};