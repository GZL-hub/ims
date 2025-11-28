import React, { useEffect, useState, useMemo } from "react";
import {
  getAllCustomers,
  createCustomer,
  type Customer as CustomerType,
  type CustomerInput,
} from "../services/customerService";
import CustomerSearchAndFilter from "../components/crm/CustomerSearchAndFilter";
import CustomerTable from "../components/crm/CustomerTable";
import AddCustomerModal from "../components/crm/AddCustomerModal";
import SuccessToast from "../components/inventory/SuccessToast";

type ModalType = "add" | null;

const CRM: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  // Form data for new customer
  const [formData, setFormData] = useState<CustomerInput>({
    customer_name: "",
    email: "",
    organization: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    notes: "",
    status: "Active",
  });

  // Fetch customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAddModal = () => {
    setFormData({
      customer_name: "",
      email: "",
      organization: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      notes: "",
      status: "Active",
    });
    setModalType("add");
  };

  const closeModal = () => setModalType(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const createdCustomer = await createCustomer(formData);
      setCustomers((prev) => [createdCustomer, ...prev]);
      closeModal();
      showSuccessMessage("Customer created successfully!");
    } catch (err: any) {
      console.error("Error creating customer:", err);
      alert("Failed to create customer. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.customer_name.toLowerCase().includes(q) ||
          customer.email.toLowerCase().includes(q) ||
          customer.organization.toLowerCase().includes(q) ||
          customer._id.toLowerCase().includes(q)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((customer) => customer.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.customer_name.localeCompare(b.customer_name);
        case "name-desc":
          return b.customer_name.localeCompare(a.customer_name);
        case "date-newest":
          return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
        case "date-oldest":
          return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
        case "orders-most":
          return (b.total_orders || 0) - (a.total_orders || 0);
        case "orders-least":
          return (a.total_orders || 0) - (b.total_orders || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, searchQuery, selectedStatus, sortBy]);

  if (loading) {
    return <p className="text-text-600">Loading customers...</p>;
  }

  return (
    <>
      <div className="space-y-6">
        <CustomerSearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddCustomer={openAddModal}
        />
        <CustomerTable
          customers={filteredCustomers}
          setCustomers={setCustomers}
          onShowSuccess={showSuccessMessage}
        />
      </div>

      <AddCustomerModal
        isOpen={modalType === "add"}
        onClose={closeModal}
        onSubmit={handleAddCustomer}
        formData={formData}
        onInputChange={handleInputChange}
        isSubmitting={isSubmitting}
      />

      <SuccessToast message={successMessage} isVisible={showSuccess} />
    </>
  );
};

export default CRM;
