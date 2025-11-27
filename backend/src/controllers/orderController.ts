import { Request, Response } from "express";
import Order from "../models/orderModel.js";
import Inventory from "../models/inventoryModel.js";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_name, email, organization, phone, items } = req.body;

    if (!customer_name || !items || !items.length) {
      return res.status(400).json({ message: "Customer name and items are required" });
    }

    // Deduct quantities from inventory
    for (const orderItem of items) {
      const inventoryItem = await Inventory.findById(orderItem.inventoryId);
      if (!inventoryItem) return res.status(404).json({ message: `Inventory item not found: ${orderItem.item_name}` });
      if (inventoryItem.quantity < orderItem.quantity) return res.status(400).json({ message: `Not enough stock for item: ${orderItem.item_name}` });

      inventoryItem.quantity -= orderItem.quantity;
      await inventoryItem.save();
    }

    const order = new Order({ customer_name, email, organization, phone, items });
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

// Update order (full edit)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { customer_name, email, organization, phone, status, items } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If items changed, adjust inventory
    if (items) {
      // Restore old items to inventory
      for (const oldItem of order.items) {
        const invItem = await Inventory.findById(oldItem.inventoryId);
        if (invItem) {
          invItem.quantity += oldItem.quantity;
          await invItem.save();
        }
      }

      // Deduct new items from inventory
      for (const newItem of items) {
        const invItem = await Inventory.findById(newItem.inventoryId);
        if (!invItem) return res.status(404).json({ message: `Inventory item not found: ${newItem.item_name}` });
        if (invItem.quantity < newItem.quantity) return res.status(400).json({ message: `Not enough stock for item: ${newItem.item_name}` });

        invItem.quantity -= newItem.quantity;
        await invItem.save();
      }

      order.items = items;
    }

    if (customer_name) order.customer_name = customer_name;
    if (email) order.email = email;
    if (organization) order.organization = organization;
    if (phone) order.phone = phone;
    if (status && ["Pending", "Completed", "Cancelled"].includes(status)) order.status = status;

    order.last_updated = new Date();
    await order.save();

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete order (restore inventory)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    for (const item of order.items) {
      const invItem = await Inventory.findById(item.inventoryId);
      if (invItem) {
        invItem.quantity += item.quantity;
        await invItem.save();
      }
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};