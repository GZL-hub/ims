import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  item_name: string;
  category: string;
  quantity: number;
  expiry_date?: Date;
  threshold: number;
  barcode: string;
  image?: string;  // Path to uploaded image file
  status?: string;
  date_added?: Date;
  last_updated?: Date;
}

const InventorySchema = new Schema<IInventory>({
  item_name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiry_date: { type: Date },
  threshold: { type: Number, default: 10 },
  barcode: { type: String, required: false},
  image: { type: String, required: false },  // Store file path, not the file itself
  status: { type: String, default: "In Stock" },
  date_added: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now },
});

// Utility function to calculate item status
function calculateStatus(quantity: number, threshold: number, expiry_date?: Date): string {
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
}

// Pre-save middleware to automatically update status
InventorySchema.pre('save', function(next) {
  this.status = calculateStatus(this.quantity, this.threshold, this.expiry_date);
  this.last_updated = new Date();
  next();
});

// Pre-update middleware to automatically update status
InventorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;

  // Get the current document to access existing values
  this.model.findOne(this.getQuery()).then((doc) => {
    if (doc) {
      const quantity = update.quantity !== undefined ? update.quantity : doc.quantity;
      const threshold = update.threshold !== undefined ? update.threshold : doc.threshold;
      const expiry_date = update.expiry_date !== undefined ? update.expiry_date : doc.expiry_date;

      update.status = calculateStatus(quantity, threshold, expiry_date);
      update.last_updated = new Date();
    }
    next();
  }).catch((err) => {
    next(err);
  });
});

export default mongoose.model<IInventory>("Inventory", InventorySchema, "inventory");