import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  customer_name: string;
  email: string;
  organization: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  status: "Active" | "Inactive";
  total_orders?: number;
  date_created?: Date;
  last_updated?: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  customer_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  organization: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  notes: { type: String },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  total_orders: { type: Number, default: 0 },
  date_created: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

export default mongoose.model<ICustomer>("Customer", CustomerSchema, "customers");
