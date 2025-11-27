import React from "react";
import { X as XIcon, Loader2 } from "lucide-react";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: {
    customer: string;
    email: string;
    organization: string;
    phone?: string;
    items: { inventoryId: string; itemName: string; quantity: number }[];
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onItemQuantityChange: (inventoryId: string, quantity: number) => void;
  onRowItemChange: (rowIndex: number, newItemId: string) => void;
  onAddNewItem: (newItemId: string) => void;
  onRemoveItem: (inventoryId: string) => void;
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
  onRowItemChange,
  onAddNewItem,
  onRemoveItem,
  isSubmitting,
  inventoryItems,
}) => {
  if (!isOpen) return null;

  // Compute available options for each row
  const getAvailableOptions = (rowIndex: number) =>
    inventoryItems.filter(
      (item) =>
        !formData.items.some(
          (i, idx) => i.inventoryId === item._id && idx !== rowIndex
        )
    );

  // Options for the "new item" row
  const getNewItemOptions = () =>
    inventoryItems.filter(
      (item) => !formData.items.some((i) => i.inventoryId === item._id)
    );

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
            <XIcon className="w-5 h-5 text-text-600" />
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

          {/* Customer Email */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="Enter customer email"
              className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Customer Organization */}
          <div>
          <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
            Organization <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={onInputChange}
            placeholder="Enter organization name"
            className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Phone Number 
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              placeholder="Enter customer phone"
              className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Select Item Header */}
          <div>
            <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
              Select Item
            </label>

            {/* Existing Item Rows */}
            {formData.items.map((row, idx) => {
              const options = getAvailableOptions(idx);
              const itemInfo = inventoryItems.find((i) => i._id === row.inventoryId);
              if (!itemInfo) return null;

              return (
                <div key={row.inventoryId} className="flex items-center gap-3 mb-3">
                  <select
                    value={row.inventoryId}
                    onChange={(e) => onRowItemChange(idx, e.target.value)}
                    className="border border-background-300 rounded-lg px-3 py-2 flex-1"
                    disabled={isSubmitting}
                  >
                    <option value="">+ Select Item</option>
                    {options.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.item_name} 
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    max={itemInfo.quantity}
                    value={row.quantity}
                    onChange={(e) =>
                      onItemQuantityChange(row.inventoryId, Number(e.target.value))
                    }
                    className="w-20 border border-background-300 rounded-lg px-2 py-1"
                    disabled={isSubmitting}
                  />

                  <button
                    type="button"
                    onClick={() => onRemoveItem(row.inventoryId)}
                    className="text-red-500 hover:underline"
                    disabled={isSubmitting}
                  >
                    <XIcon className="w-5 h-5 stroke-[2]" />
                  </button>
                </div>
              );
            })}

            {/* Add New Item Row */}
            <div className="flex items-center gap-3">
              <select
                value=""
                onChange={(e) => onAddNewItem(e.target.value)}
                className="border border-background-300 rounded-lg px-3 py-2 flex-1"
                disabled={isSubmitting}
              >
                <option value="">+ Select Item</option>
                {getNewItemOptions().map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.item_name}
                  </option>
                ))}
              </select>
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
              disabled={
                isSubmitting || 
                !formData.customer || 
                !formData.email ||
                formData.items.every(i => i.quantity <= 0)}
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