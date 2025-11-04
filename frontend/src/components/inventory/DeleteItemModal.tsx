import React from "react";
import { Package, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import type { InventoryItem } from "../../services/inventoryService";

interface DeleteItemModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-md border border-background-200 dark:border-[#2a2a2a] m-4">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-background-200 dark:border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-text-950 dark:text-white">
              Delete Item
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-text-700 dark:text-text-300 mb-4">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-text-900 dark:text-white">{item.item_name}</p>
                <p className="text-sm text-text-600 dark:text-text-400 mt-1">
                  Category: {item.category} • Quantity: {item.quantity}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-background-50 dark:bg-[#171717] border-t border-background-200 dark:border-[#2a2a2a] rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-background-300 dark:border-background-600 text-text-700 dark:text-text-300 rounded-lg hover:bg-background-100 dark:hover:bg-background-800 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isSubmitting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md"
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Item
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
