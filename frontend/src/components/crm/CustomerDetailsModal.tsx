import React from "react";
import ReactDOM from "react-dom";
import { X, Edit2, Trash2, User, Mail, Building, Phone, MapPin, Globe, FileText, CheckCircle, XCircle } from "lucide-react";
import type { Customer as CustomerType } from "../../services/customerService";

interface CustomerDetailsModalProps {
  customer: CustomerType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const getStatusBadge = (status: string) => {
  const styles = {
    Active: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    Inactive: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  const style = styles[status as keyof typeof styles];
  if (!style) return status;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
      {style.icon}
      {status}
    </span>
  );
};

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customer,
  onClose,
  onEdit,
  onDelete,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-background-100 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-background-200 dark:border-background-300" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white dark:bg-background-100 border-b border-background-200 dark:border-background-300 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-950 dark:text-white">Customer Details</h2>
            <p className="text-text-600 dark:text-text-400 text-sm mt-1">ID: {customer._id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(customer.status)}
            <button onClick={onClose} className="p-2 hover:bg-background-100 dark:hover:bg-background-200 rounded-lg transition-colors" title="Close">
              <X className="w-5 h-5 text-text-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="bg-background-50 dark:bg-background-100 rounded-lg p-5 border border-background-200 dark:border-background-300">
              <h3 className="text-lg font-semibold text-text-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-text-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Name</p>
                    <p className="text-sm font-medium text-text-900 dark:text-white mt-1">{customer.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-text-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-text-900 dark:text-white mt-1">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-text-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Organization</p>
                    <p className="text-sm font-medium text-text-900 dark:text-white mt-1">{customer.organization}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-text-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-medium text-text-900 dark:text-white mt-1">{customer.phone || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background-50 dark:bg-background-100 rounded-lg p-5 border border-background-200 dark:border-background-300">
              <h3 className="text-lg font-semibold text-text-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-text-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Address</p>
                    <p className="text-sm font-medium text-text-900 dark:text-white mt-1">{customer.address || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-text-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">City</p>
                    <p className="text-sm font-medium text-text-900 dark:text-white mt-1">{customer.city || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-text-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Country</p>
                    <p className="text-sm font-medium text-text-900 dark:text-white mt-1">{customer.country || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="bg-background-50 dark:bg-background-100 rounded-lg p-5 border border-background-200 dark:border-background-300">
                <h3 className="text-lg font-semibold text-text-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Notes
                </h3>
                <p className="text-sm text-text-700 dark:text-text-300">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-background-50 dark:bg-background-100 px-6 py-4 border-t border-background-200 dark:border-background-300 flex flex-wrap gap-3 justify-end">
          <button onClick={onEdit} className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2 shadow-sm">
            <Edit2 className="w-4 h-4" />
            Edit Customer
          </button>
          <button onClick={onDelete} className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition flex items-center gap-2 shadow-sm">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomerDetailsModal;
