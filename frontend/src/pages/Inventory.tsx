// Need the option for custom categories in the future
// Replaced axios with fetch in inventoryService for auth token handling, hope this shit doesn't break again
import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import {
  getAllInventoryItems,
  createInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
  type InventoryItem,
} from "../services/inventoryService";
import AddItemModal from "../components/inventory/AddItemModal";
import EditItemModal from "../components/inventory/EditItemModal";
import DeleteItemModal from "../components/inventory/DeleteItemModal";
import SuccessToast from "../components/inventory/SuccessToast";
import SummaryCards from "../components/inventory/SummaryCards";
import InventoryTable from "../components/inventory/InventoryTable";

type ModalType = "add" | "edit" | "delete" | null;

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Track form values for required fields
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    threshold: "",
    barcode: "",
    expiry_date: "",
    image: "",
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (imageData: string) => {
    setFormData((prev) => ({ ...prev, image: imageData }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      item_name: "",
      category: "",
      quantity: "",
      threshold: "",
      barcode: "",
      expiry_date: "",
      image: "",
    });
  };

  // Show success message
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setModalType("add");
  };

  // Open edit modal
  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name,
      category: item.category,
      quantity: item.quantity.toString(),
      threshold: item.threshold.toString(),
      barcode: item.barcode || "",
      expiry_date: item.expiry_date ? item.expiry_date.split("T")[0] : "",
      image: item.image || "",
    });
    setModalType("edit");
  };

  // Open delete modal
  const openDeleteModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalType("delete");
  };

  // Close modal
  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
    resetForm();
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getAllInventoryItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert form data to proper types
    const newItem = {
      item_name: formData.item_name,
      category: formData.category,
      quantity: Number(formData.quantity),
      threshold: Number(formData.threshold) || 10,
      barcode: formData.barcode || "",
      expiry_date: formData.expiry_date || undefined,
      image: formData.image || undefined,
    };

    try {
      await createInventoryItem(newItem);

      // Refresh the inventory list
      const updatedItems = await getAllInventoryItems();
      setItems(updatedItems);

      closeModal();
      showSuccessMessage("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);

    const updatedItem = {
      item_name: formData.item_name,
      category: formData.category,
      quantity: Number(formData.quantity),
      threshold: Number(formData.threshold) || 10,
      barcode: formData.barcode || "",
      expiry_date: formData.expiry_date || undefined,
      image: formData.image || undefined,
    };

    try {
      await updateInventoryItem(selectedItem._id, updatedItem);

      // Refresh the inventory list
      const updatedItems = await getAllInventoryItems();
      setItems(updatedItems);

      closeModal();
      showSuccessMessage("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);

    try {
      await deleteInventoryItem(selectedItem._id);

      // Instantly update UI
      setItems((prev) => prev.filter((item) => item._id !== selectedItem._id));

      closeModal();
      showSuccessMessage("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-text-600">Loading inventory...</p>;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-600">
              Track and manage facility inventory and resources
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <Package className="w-4 h-4" />
            Add Item
          </button>
        </div>

      {/* Summary Cards */}
      <SummaryCards items={items} />

      {/* Inventory Table */}
      <InventoryTable
        items={items}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />
      </div>

      {/* Modals - Outside of main content wrapper */}
      <SuccessToast message={successMessage} isVisible={showSuccess} />

      <AddItemModal
        isOpen={modalType === "add"}
        onClose={closeModal}
        onSubmit={handleAddItem}
        formData={formData}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        isSubmitting={isSubmitting}
        categories={categories}
      />

      <EditItemModal
        isOpen={modalType === "edit"}
        onClose={closeModal}
        onSubmit={handleEditItem}
        formData={formData}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        isSubmitting={isSubmitting}
        categories={categories}
      />

      <DeleteItemModal
        isOpen={modalType === "delete"}
        item={selectedItem}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default Inventory;
