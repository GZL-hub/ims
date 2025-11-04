import React from "react";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";
import type { InventoryItem } from "../../services/inventoryService";

interface SummaryCardsProps {
  items: InventoryItem[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ items }) => {
  const inStockCount = items.filter((i) => i.status === "In Stock").length;
  const lowStockCount = items.filter((i) => i.status === "Low Stock").length;
  const totalCount = items.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* In Stock Card */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-text-700">In Stock</h3>
        </div>
        <p className="text-2xl font-bold text-text-950">{inStockCount}</p>
      </div>

      {/* Low Stock Card */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-sm font-medium text-text-700">Low Stock</h3>
        </div>
        <p className="text-2xl font-bold text-text-950">{lowStockCount}</p>
      </div>

      {/* Total Items Card */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="text-sm font-medium text-text-700">Total Items</h3>
        </div>
        <p className="text-2xl font-bold text-text-950">{totalCount}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
