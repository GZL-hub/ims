import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  inventoryId: mongoose.Schema.Types.ObjectId; // Reference to Inventory item
  item_name: string;
  quantity: number;
}

export interface IOrder extends Document {
  customer_name: string;
  email: string;
  phone?: string;
  items: IOrderItem[];
  status: "Pending" | "Completed" | "Cancelled";
  date_created?: Date;
  last_updated?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  inventoryId: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
  item_name: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  customer_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  items: [OrderItemSchema],
  status: { type: String, default: "Pending" },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", OrderSchema, "orders");