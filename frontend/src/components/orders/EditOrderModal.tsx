import React from "react";
import ReactDOM from "react-dom";
import { X, Trash2 } from "lucide-react";
import type { Order as OrderType } from "../../services/orderService";

interface EditOrderModalProps {
  order: OrderType;
  onClose: () => void;
  onSave: (updatedOrder: OrderType) => void; // now partial
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose, onSave }) => {
  const [editableOrder, setEditableOrder] = React.useState<OrderType>({ ...order });

  /** Update a single item quantity */
  const updateItemQuantity = (index: number, qty: number) => {
    const updatedItems = [...editableOrder.items];
    updatedItems[index] = { ...updatedItems[index], quantity: qty };
    setEditableOrder({ ...editableOrder, items: updatedItems });
  };

  /** Remove item */
  const removeItem = (index: number) => {
    const updatedItems = editableOrder.items.filter((_, i) => i !== index);
    setEditableOrder({ ...editableOrder, items: updatedItems });
  };

  /** Save changes */
  const handleSave = () => {
    const payload: OrderType = {
      ...order,
      customer_name: editableOrder.customer_name,
      email: editableOrder.email,
      organization: editableOrder.organization,
      phone: editableOrder.phone,
      items: editableOrder.items,
    };

    onSave(payload);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-50 rounded-lg max-w-3xl w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-text-900 dark:text-white mb-4">
          Edit Order
        </h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-700 dark:text-text-300 hover:text-red-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Customer Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={editableOrder.customer_name}
              onChange={(e) =>
                setEditableOrder({ ...editableOrder, customer_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 block w-full border rounded-md p-2"
              value={editableOrder.email}
              onChange={(e) =>
                setEditableOrder({ ...editableOrder, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Organization</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={editableOrder.organization}
              onChange={(e) =>
                setEditableOrder({ ...editableOrder, organization: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={editableOrder.phone || ""}
              onChange={(e) =>
                setEditableOrder({ ...editableOrder, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* Item Editor */}
        <div className="mt-6">
        <h3 className="text-md font-semibold mb-3">Items</h3>

        {editableOrder.items.map((item, index) => {
            return (
            <div key={item.inventoryId} className="flex items-center gap-3 mb-3">
                {/* Item Box */}
                <div className="flex-1 border border-background-300 dark:border-background-400 rounded-lg px-3 py-2 bg-white dark:bg-background-50">
                {item.itemName}
                </div>

                {/* Quantity Input */}
                <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItemQuantity(index, Number(e.target.value))}
                className="w-20 border border-background-300 dark:border-background-400 rounded-lg px-2 py-1 text-center"
                />

                {/* Trash Button */}
                <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800 p-1"
                >
                <Trash2 className="w-5 h-5" />
                </button>
            </div>
            );
        })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-background-100 dark:hover:bg-background-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black shadow-sm hover:shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditOrderModal;