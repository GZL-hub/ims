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
import {
  getAllCustomers,
  type Customer,
} from "../services/customerService"; 
import AddOrderModal from "../components/orders/AddOrderModal";
import SuccessToast from "../components/inventory/SuccessToast";
import OrderSearchAndFilter from "../components/orders/OrderSearchAndFilter";
import OrderTable from "../components/orders/OrderTable";

type ModalType = "add" | null;

const Orders: React.FC = () => {
  // State
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
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
    customerId?: string;
    customer_name: string;
    email: string;
    organization: string;
    phone?: string;
    items: { inventoryId: string; itemName: string; quantity: number }[];
  }>({
    customerId: undefined,
    customer_name: "",
    email: "",
    organization: "",
    phone: "",
    items: [],
  });

  // Handle adding a custom item to the order
  const handleAddCustomItem = (name: string, quantity: number, category?: string) => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, {
         inventoryId: `custom-${Date.now()}`, 
         itemName: name, 
         quantity,
         category ,
         isCustom: true,
        }],
    }));
  }

  // Fetch orders, inventory, and customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, inventoryData, customersData] = await Promise.all([
          getAllOrders(),
          getAllInventoryItems(),
          getAllCustomers(),
        ]);
        setOrders(ordersData);
        setInventoryItems(inventoryData);
        setCustomers(customersData.filter(c => c.status === "Active")); // Only active customers
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Open modal
  const openAddModal = () => {
    setFormData({
      customerId: undefined,
      customer_name: "",
      email: "",
      organization: "",
      phone: "",
      items: [],
    });
    setModalType("add");
  };

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer | null) => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerId: customer._id,
        customer_name: customer.customer_name,
        email: customer.email,
        organization: customer.organization,
        phone: customer.phone || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customerId: undefined,
        customer_name: "",
        email: "",
        organization: "",
        phone: "",
      }));
    }
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
    const itemInfo = inventoryItems.find(i => i._id === inventoryId);
    if (!itemInfo) return;

    if (quantity > itemInfo.quantity) {
      showSuccessMessage(`Cannot exceed available stock (${itemInfo.quantity}) for ${itemInfo.item_name}.`);
      quantity = itemInfo.quantity;
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.inventoryId === inventoryId ? { ...item, quantity } : item
      ),
    }));
  };

  // Handle row item change
  const handleRowItemChange = (rowIndex: number, newItemId: string) => {
    const found = inventoryItems.find((i) => i._id === newItemId);
    if (!found) return;
    setFormData((prev) => {
      const updated = [...prev.items];
      updated[rowIndex] = { inventoryId: found._id, itemName: found.item_name, quantity: 1 };
      return { ...prev, items: updated };
    });
  };

  // Handle adding a new item row
  const handleAddNewItem = (newItemId: string) => {
    const found = inventoryItems.find((i) => i._id === newItemId);
    if (!found) return;
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { inventoryId: found._id, itemName: found.item_name, quantity: 1 }],
    }));
  };

  // Handle removing an item row
  const handleRemoveItem = (inventoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.inventoryId !== inventoryId),
    }));
  };

  // Submit new order
  const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    const newOrder: OrderInput = {
      customer_name: formData.customer_name,
      email: formData.email,
      organization: formData.organization,
      phone: formData.phone,
      status: "Pending",
      items: formData.items.filter(i => i.quantity > 0),
    };

    try {
      const createdOrder = await createOrder(newOrder);
      setOrders(prev => [createdOrder, ...prev]);
      closeModal();
      showSuccessMessage("Order created successfully!");
    } catch (err: unknown) {
      console.error("Error creating order:", err);
      alert("Failed to create order. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          order.customer_name.toLowerCase().includes(q)
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
        case "customer-asc":
          return a.customer_name.localeCompare(b.customer_name);
        case "customer-desc":
          return b.customer_name.localeCompare(a.customer_name);
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
        <OrderSearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddOrder={openAddModal}
        />
        <OrderTable orders={filteredOrders} setOrders={setOrders} onShowSuccess={showSuccessMessage} />
      </div>

      <AddOrderModal
        isOpen={modalType === "add"}
        onClose={closeModal}
        onSubmit={handleAddOrder}
        formData={formData}
        onInputChange={handleInputChange}
        onItemQuantityChange={handleItemQuantityChange}
        onRowItemChange={handleRowItemChange}
        onAddNewItem={handleAddNewItem}
        onRemoveItem={handleRemoveItem}
        onCustomerSelect={handleCustomerSelect}
        isSubmitting={isSubmitting}
        inventoryItems={inventoryItems}
        customers={customers}
        onAddCustomItem={handleAddCustomItem}
      />

      <SuccessToast message={successMessage} isVisible={showSuccess} />
    </>
  );
};

export default Orders;