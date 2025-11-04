import React from "react";
import { Edit, Trash2 } from "lucide-react";
import type { InventoryItem } from "../../services/inventoryService";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="bg-background-50 border border-background-200 rounded-lg overflow-hidden shadow-sm">
      <table className="min-w-full divide-y divide-background-200">
        <thead className="bg-background-100">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-text-600 uppercase tracking-wider">
              Item Name
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-text-600 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-text-600 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-text-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-text-600 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-text-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-background-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-text-600">
                No inventory items found. Click "Add Item" to get started.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item._id} className="hover:bg-background-100 transition-colors">
                <td className="px-6 py-4 text-sm text-text-900">{item.item_name}</td>
                <td className="px-6 py-4 text-sm text-text-700 text-center">{item.category}</td>
                <td className="px-6 py-4 text-sm text-text-700 text-center">{item.quantity}</td>
                <td
                  className={`px-6 py-4 text-sm font-medium text-center ${
                    item.status === "Low Stock"
                      ? "text-yellow-600"
                      : item.status === "Expired"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {item.status}
                </td>
                <td className="px-6 py-4 text-sm text-text-700 text-center">
                  {item.last_updated
                    ? new Date(item.last_updated).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-text-700 flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit item"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
