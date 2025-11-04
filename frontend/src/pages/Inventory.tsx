import React, { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { Package, AlertTriangle, CheckCircle, Edit, Trash2 } from "lucide-react";
import { authService } from "../services/authService";

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
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Track form values for required fields
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = authService.getAccessToken(); 
    axios
      .get<InventoryItem[]>("http://localhost:3001/api/inventory", {
        headers: { Authorization: `Bearer ${token}` }, 
      })
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

  // Prefill modal form when editing an item
  useEffect(() => {
    if (editingItem) {
      setFormData({
        item_name: editingItem.item_name || "",
        category: editingItem.category || "",
        quantity: editingItem.quantity.toString() || "",
      });
    } else {
      // Reset form when not editing
      setFormData({
        item_name: "",
        category: "",
        quantity: "",
      });
    }
  }, [editingItem]);

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newItem = Object.fromEntries(formData.entries());
    const token = authService.getAccessToken(); 

    try {
      await axios.post("http://localhost:3001/api/inventory", newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      const res = await axios.get<InventoryItem[]>("http://localhost:3001/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const categories = [
    "Electronics",
    "Furniture",
    "Stationery",
    "Cleaning Supplies",
    "Tools",
    "Other",
  ];

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const updatedItem = Object.fromEntries(formData.entries());
    const token = authService.getAccessToken();

    try {
      await axios.put(
        `http://localhost:3001/api/inventory/${editingItem._id}`,
        updatedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get<InventoryItem[]>("http://localhost:3001/api/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);

      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving edited item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = authService.getAccessToken();
    try {
      await axios.delete(`http://localhost:3001/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

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
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
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
            {items.map((item) => (
              <tr key={item._id}>
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
                <td className="px-6 py-4 text-sm text-text-700 flex justify-center gap-5">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(item);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Add Item Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-2xl w-full max-w-md border border-background-200 dark:border-[#2a2a2a] transition-all duration-200">
            <h2 className="text-xl font-semibold text-text-950 mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h2>

            <form onSubmit={editingItem ? handleSaveEdit : handleAddItem} className="space-y-3">
              {/* Item Name */}
              <label className="block text-sm font-medium text-text-900 dark:text-white">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="item_name"
                placeholder="Enter item name"
                value={formData.item_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-background-700 dark:border-background-600"
                required
              />

              {/* Category */}
              <label className="block text-sm font-medium text-text-900 dark:text-white">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-background-700 dark:border-background-600"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Quantity */}
              <label className="block text-sm font-medium text-text-900 dark:text-white">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-background-700 dark:border-background-600"
                required
              />

              {/* Expiry Date */}
              <label className="block text-sm font-medium text-text-900 dark:text-white">
                Expiry Date (optional)
              </label>
              <input
                type="date"
                name="expiry_date"
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-background-700 dark:border-background-600"
              />

              {/* Barcode */}
              <label className="block text-sm font-medium text-text-900 dark:text-white">
                Barcode (optional)
              </label>
              <input
                type="text"
                name="barcode"
                placeholder="Enter barcode (if applicable)"
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-background-700 dark:border-background-600"
              />

              {/* Disclaimer */}
              <p className="text-xs text-text-600 mt-2">
                <span className="text-red-500">*</span> Fields marked with an asterisk are required. You cannot proceed without filling them.
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({ item_name: "", category: "", quantity: "" });
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.item_name || !formData.category || !formData.quantity}
                  className={`px-4 py-2 rounded-md text-white transition-colors ${
                    !formData.item_name || !formData.category || !formData.quantity
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-2xl w-full max-w-sm border border-background-200 dark:border-[#2a2a2a] transition-all duration-200">
            <h2 className="text-xl font-semibold text-text-950 mb-3 text-center">
              Confirm Delete
            </h2>
            <p className="text-text-700 dark:text-gray-300 text-center mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-red-500">{itemToDelete.item_name}</span> from the inventory?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(itemToDelete._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
