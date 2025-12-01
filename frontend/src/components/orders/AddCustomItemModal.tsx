import React, { useState } from "react";
import { X as XIcon, Loader2 } from "lucide-react";

const categories = [
  "Electronics",
  "Furniture",
  "Stationery",
  "Cleaning Supplies",
  "Tools",
  "Other",
];

interface AddCustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemName: string, quantity: number, category?: string) => void;
  isSubmitting?: boolean;
}

const AddCustomItemModal: React.FC<AddCustomItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<string | undefined>(undefined);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-background-100 rounded-2xl shadow-2xl w-full max-w-md border border-background-200 dark:border-background-300 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-950 dark:text-white">
            Add Custom Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-100 dark:hover:bg-background-200 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <XIcon className="w-5 h-5 text-text-600" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(itemName, quantity, category);
          }}
          className="space-y-4"
        >
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              className="w-full border border-background-300 dark:border-background-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border border-background-300 dark:border-background-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-1">
              Category (Optional)
            </label>
            <select
              value={category || ""}
              onChange={(e) => setCategory(e.target.value || undefined)}
              className="w-full border border-background-300 dark:border-background-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-background-300 dark:border-background-400 text-text-700 dark:text-text-300 rounded-lg hover:bg-background-100 dark:hover:bg-background-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !itemName}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isSubmitting || !itemName
                  ? "bg-background-300 dark:bg-background-200 text-text-500 cursor-not-allowed"
                  : "bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black shadow-sm hover:shadow-md"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add Item</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomItemModal;