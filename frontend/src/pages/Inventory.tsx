import React, { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

interface InventoryItem {
  _id: string;
  item_name: string;
  category: string;
  quantity: number;
  expiry_date?: string;
  threshold: number;
  barcode: string;
  status: string;
  date_added: string;
  last_updated?: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<InventoryItem[]>("http://localhost:3001/api/inventory")
      .then((res: AxiosResponse<InventoryItem[]>) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (axios.isAxiosError(err)) {
          const axiosError = err as import("axios").AxiosError;
          console.error("Axios error fetching inventory:", axiosError.message);
        } else {
          console.error("Unknown error fetching inventory:", err);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-text-600">Loading inventory...</p>;
  }

  return (
    <div className="space-y-6">
      {/* --- Header Section (Matches Orders Page Layout) --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-950">Inventory</h1>
          <p className="text-text-600 mt-1">
            Track and manage facility inventory and resources
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
          <Package className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background-50 border border-background-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-text-700">In Stock</h3>
          </div>
          <p className="text-2xl font-bold text-text-950">
            {items.filter((i) => i.status === "In Stock").length}
          </p>
        </div>

        <div className="bg-background-50 border border-background-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-text-700">Low Stock</h3>
          </div>
          <p className="text-2xl font-bold text-text-950">
            {items.filter((i) => i.status === "Low Stock").length}
          </p>
        </div>

        <div className="bg-background-50 border border-background-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-sm font-medium text-text-700">Total Items</h3>
          </div>
          <p className="text-2xl font-bold text-text-950">{items.length}</p>
        </div>
      </div>

      {/* --- Inventory Table --- */}
      <div className="bg-background-50 border border-background-200 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-background-200">
          <thead className="bg-background-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-600 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-600 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-600 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 text-sm text-text-900">{item.item_name}</td>
                <td className="px-6 py-4 text-sm text-text-700">{item.category}</td>
                <td className="px-6 py-4 text-sm text-text-700">{item.quantity}</td>
                <td
                  className={`px-6 py-4 text-sm font-medium ${
                    item.status === "Low Stock"
                      ? "text-yellow-600"
                      : item.status === "Expired"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {item.status}
                </td>
                <td className="px-6 py-4 text-sm text-text-700">
                  {item.last_updated
                    ? new Date(item.last_updated).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
