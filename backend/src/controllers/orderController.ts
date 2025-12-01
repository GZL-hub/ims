import { Request, Response } from "express";
import Order from "../models/orderModel.js";
import Inventory from "../models/inventoryModel.js";
import Customer from "../models/customerModel.js";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, customer_name, email, organization, phone, items } = req.body;

    if (!customer_name || !items || !items.length) {
      return res.status(400).json({ message: "Customer name and items are required" });
    }

    // If customerId provided, verify customer exists and is active
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      if (customer.status === "Inactive") {
        return res.status(400).json({ message: "Cannot create orders for inactive customers" });
      }
    }

    // Deduct quantities from inventory
    for (const orderItem of items) {
      // Skip inventory check for custom items
      if (typeof orderItem.inventoryId === "string" && orderItem.inventoryId.startsWith("custom-")) {
        continue; 
      }

      const inventoryItem = await Inventory.findById(orderItem.inventoryId);
      if (!inventoryItem) return res.status(404).json({ message: `Inventory item not found: ${orderItem.item_name}` });
      if (inventoryItem.quantity < orderItem.quantity) return res.status(400).json({ message: `Not enough stock for item: ${orderItem.item_name}` });

      inventoryItem.quantity -= orderItem.quantity;
      await inventoryItem.save();
    }

    const order = new Order({ customerId, customer_name, email, organization, phone, items });
    await order.save();

    // Increment customer's total_orders if linked
    if (customerId) {
      await Customer.findByIdAndUpdate(customerId, { $inc: { total_orders: 1 } });
    }

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

    const oldStatus = order.status;

    // Handle status change first (before items update)
    if (status && ["Pending", "Completed", "Cancelled"].includes(status)) {
      // Prevent changing status if already completed or cancelled
      if ((oldStatus === "Completed" || oldStatus === "Cancelled") && status !== oldStatus) {
        return res.status(400).json({ message: `Cannot change status from ${oldStatus} to ${status}` });
      }

      // Only restore inventory if cancelling a pending/completed order
      if (status === "Cancelled" && oldStatus !== "Cancelled") {
        for (const item of order.items) {
          const invItem = await Inventory.findById(item.inventoryId);
          if (invItem) {
            invItem.quantity += item.quantity;
            await invItem.save();
          }
        }
      }
      order.status = status;
    }

    // If items changed, adjust inventory (only for pending orders)
    if (items && order.status === "Pending") {
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

    // Update other fields if provided
    if (customer_name !== undefined) order.customer_name = customer_name;
    if (email !== undefined) order.email = email;
    if (organization !== undefined) order.organization = organization;
    if (phone !== undefined) order.phone = phone;

    order.last_updated = new Date();

    // Use save with validateModifiedOnly to only validate changed fields
    await order.save({ validateModifiedOnly: true });

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Restore inventory if order is not cancelled
    if (order.status !== "Cancelled") {
      for (const item of order.items) {
        const invItem = await Inventory.findById(item.inventoryId);
        if (invItem) {
          invItem.quantity += item.quantity;
          await invItem.save();
        }
      }
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};