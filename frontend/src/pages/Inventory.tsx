// Need the option for custom categories in the future
// Replaced axios with fetch in inventoryService for auth token handling, hope this shit doesn't break again
import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
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
import SearchAndFilter from "../components/inventory/SearchAndFilter";
import InventoryTable from "../components/inventory/InventoryTable";

type ModalType = "add" | "edit" | "delete" | null;

const Inventory: React.FC = () => {
  const location = useLocation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  // Track form values for required fields
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    threshold: "",
    barcode: "",
    expiry_date: "",
  });

  // Track image file separately
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
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
    });
    setImageFile(null);
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
    });
    setImageFile(null); // Reset image file for edit
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

  // Handle navigation state from barcode scanner
  useEffect(() => {
    const state = location.state as { searchBarcode?: string; editItem?: InventoryItem } | null;

    if (state?.searchBarcode) {
      // Set search query to the scanned barcode
      setSearchQuery(state.searchBarcode);
      // Clear the state to avoid re-triggering
      window.history.replaceState({}, document.title);
    }

    if (state?.editItem && items.length > 0) {
      // Find the item in the current items list
      const itemToEdit = items.find(item => item._id === state.editItem?._id);
      if (itemToEdit) {
        // Open edit modal directly without using the openEditModal function
        setSelectedItem(itemToEdit);
        setFormData({
          item_name: itemToEdit.item_name,
          category: itemToEdit.category,
          quantity: itemToEdit.quantity.toString(),
          threshold: itemToEdit.threshold.toString(),
          barcode: itemToEdit.barcode || "",
          expiry_date: itemToEdit.expiry_date ? itemToEdit.expiry_date.split("T")[0] : "",
        });
        setImageFile(null);
        setModalType("edit");
      }
      // Clear the state to avoid re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state, items]);

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
      image: imageFile || undefined, // Use File object instead of base64
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
      image: imageFile || undefined, // Use File object instead of base64
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

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.item_name.toLowerCase().includes(query) ||
          item.barcode?.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item._id.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.item_name.localeCompare(b.item_name);
        case "name-desc":
          return b.item_name.localeCompare(a.item_name);
        case "quantity-asc":
          return a.quantity - b.quantity;
        case "quantity-desc":
          return b.quantity - a.quantity;
        case "date-newest":
          return new Date(b.date_added || 0).getTime() - new Date(a.date_added || 0).getTime();
        case "date-oldest":
          return new Date(a.date_added || 0).getTime() - new Date(b.date_added || 0).getTime();
        case "expiry-soonest":
          // Items with expiry dates come first, sorted by date
          if (!a.expiry_date && !b.expiry_date) return 0;
          if (!a.expiry_date) return 1;
          if (!b.expiry_date) return -1;
          return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
        case "expiry-latest":
          // Items with expiry dates come first, sorted by date (reversed)
          if (!a.expiry_date && !b.expiry_date) return 0;
          if (!a.expiry_date) return 1;
          if (!b.expiry_date) return -1;
          return new Date(b.expiry_date).getTime() - new Date(a.expiry_date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchQuery, selectedCategory, selectedStatus, sortBy]);

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
        {/* Search and Filter Section */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          categories={categories}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddItem={openAddModal}
        />

      {/* Inventory Table */}
      <InventoryTable
        items={filteredItems}
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
        imageFile={imageFile}
        isSubmitting={isSubmitting}
        categories={categories}
      />

      <EditItemModal
        isOpen={modalType === "edit"}
        onClose={closeModal}
        onSubmit={handleEditItem}
        formData={formData}
        selectedItem={selectedItem}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        imageFile={imageFile}
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
