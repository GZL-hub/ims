import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  item_name: string;
  category: string;
  quantity: number;
  expiry_date?: Date;
  threshold: number;
  barcode: string;
  status?: string;
  date_added?: Date;
  last_updated?: Date;
}

const InventorySchema = new Schema<IInventory>({
  item_name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiry_date: { type: Date },
  threshold: { type: Number, default: 1 },
  barcode: { type: String, required: true, unique: true },
  status: { type: String, default: "In Stock" },
  date_added: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

// 👇 This third argument ensures Mongoose uses the existing 'inventory' collection
export default mongoose.model<IInventory>("Inventory", InventorySchema, "inventory");