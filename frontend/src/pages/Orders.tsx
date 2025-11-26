import React, { useEffect, useState, useMemo } from "react";
import {
  getAllInventoryItems,
  type InventoryItem,
} from "../services/inventoryService";
import {
  getAllOrders,
  createOrder,
  type Order as OrderType,
  type OrderInput, 
} from "../services/orderService"; 
import AddOrderModal from "../components/orders/AddOrderModal";
import SuccessToast from "../components/inventory/SuccessToast";
import SearchAndFilter from "../components/inventory/SearchAndFilter";
import OrderTable from "../components/orders/OrderTable";

type ModalType = "add" | null;

const Orders: React.FC = () => {
  // State
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");

  // Form data for new order
  const [formData, setFormData] = useState<{
    customer: string;
    items: { inventoryId: string; itemName: string; quantity: number }[];
  }>({
    customer: "",
    items: [],
  });

  // Fetch orders and inventory
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, inventoryData] = await Promise.all([
          getAllOrders(),
          getAllInventoryItems(),
        ]);
        console.log("Fetched inventory:", inventoryData);
        setOrders(ordersData);
        setInventoryItems(inventoryData);
      } catch (err) {
        console.error("Error fetching orders or inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Open modal
  const openAddModal = () => {
    setFormData({
      customer: "",
      items: inventoryItems.map((item) => ({
        inventoryId: item._id,
        itemName: item.item_name,
        quantity: 0,
      })),
    });
    setModalType("add");
  };

  // Close modal
  const closeModal = () => setModalType(null);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle item quantity change
  const handleItemQuantityChange = (inventoryId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.inventoryId === inventoryId ? { ...item, quantity } : item
      ),
    }));
  };

  // Submit new order
  const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newOrder: OrderInput = {
      customer: formData.customer,
      status: "Pending",
      items: formData.items.filter(i => i.quantity > 0),
    };

    console.log("Payload being sent to backend:", newOrder);

    try {
      const createdOrder = await createOrder(newOrder);
      setOrders(prev => [createdOrder, ...prev]);
      closeModal();
      showSuccessMessage("Order created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error creating order:", err.message);
      } else {
        console.error("Unknown error creating order:", err);
      }
      alert("Failed to create order. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(q) ||
          order.customer.toLowerCase().includes(q)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-newest":
          return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
        case "date-oldest":
          return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchQuery, selectedStatus, sortBy]);

  if (loading) {
    return <p className="text-text-600">Loading orders...</p>;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory="" // not needed for orders
          onCategoryChange={() => {}}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          categories={[]} // not used
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddItem={openAddModal}
        />

        {/* Orders Table */}
        <OrderTable orders={filteredOrders} />
      </div>

      {/* Modals */}
      <AddOrderModal
        isOpen={modalType === "add"}
        onClose={closeModal}
        onSubmit={handleAddOrder}
        formData={formData}
        onInputChange={handleInputChange}
        onItemQuantityChange={handleItemQuantityChange}
        isSubmitting={isSubmitting}
        inventoryItems={inventoryItems}
      />

      <SuccessToast message={successMessage} isVisible={showSuccess} />
    </>
  );
};

export default Orders;