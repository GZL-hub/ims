import React from "react";
import { X, Loader2 } from "lucide-react";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: {
    customer: string;
    items: { inventoryId: string; itemName: string; quantity: number }[];
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onItemQuantityChange: (inventoryId: string, quantity: number) => void;
  isSubmitting: boolean;
  inventoryItems: { _id: string; item_name: string; quantity: number }[];
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  onItemQuantityChange,
  isSubmitting,
  inventoryItems,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-background-100 rounded-2xl shadow-2xl w-full max-w-3xl border border-background-200 dark:border-background-300 max-h-[90vh] overflow-y-auto m-4">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-background-100 border-b border-background-200 dark:border-background-300 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-text-950 dark:text-white">
            Create New Order
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-100 dark:hover:bg-background-200 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-text-600" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={onInputChange}
              placeholder="Enter customer name"
              className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Inventory Items Selection */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
              Select Items
            </label>
            <div className="space-y-3 max-h-64 overflow-y-auto border border-background-300 dark:border-background-400 rounded-lg p-3">
              {inventoryItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <span>{item.item_name} (Available: {item.quantity})</span>
                  <input
                    type="number"
                    min={0}
                    max={item.quantity}
                    value={
                      formData.items.find((i) => i.inventoryId === item._id)?.quantity || 0
                    }
                    onChange={(e) =>
                      onItemQuantityChange(item._id, Number(e.target.value))
                    }
                    className="w-20 border border-background-300 dark:border-background-400 rounded-lg px-2 py-1"
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-background-200 dark:border-background-300">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-background-300 dark:border-background-400 text-text-700 dark:text-text-300 rounded-lg hover:bg-background-100 dark:hover:bg-background-200 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.customer || formData.items.every(i => i.quantity <= 0)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isSubmitting || !formData.customer || formData.items.every(i => i.quantity <= 0)
                  ? "bg-background-300 dark:bg-background-200 text-text-500 cursor-not-allowed"
                  : "bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black shadow-sm hover:shadow-md"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Order</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;