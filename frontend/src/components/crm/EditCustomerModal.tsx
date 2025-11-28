import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import type { Customer as CustomerType } from "../../services/customerService";

interface EditCustomerModalProps {
  customer: CustomerType;
  onClose: () => void;
  onSave: (updatedCustomer: CustomerType) => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ customer, onClose, onSave }) => {
  const [editableCustomer, setEditableCustomer] = useState<CustomerType>({ ...customer });

  const handleSave = () => {
    onSave(editableCustomer);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-background-100 rounded-2xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-text-900 dark:text-white mb-4">Edit Customer</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-text-700 dark:text-text-300 hover:text-red-500 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input type="text" className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.customer_name} onChange={(e) => setEditableCustomer({ ...editableCustomer, customer_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.email} onChange={(e) => setEditableCustomer({ ...editableCustomer, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organization</label>
            <input type="text" className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.organization} onChange={(e) => setEditableCustomer({ ...editableCustomer, organization: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.phone || ""} onChange={(e) => setEditableCustomer({ ...editableCustomer, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.city || ""} onChange={(e) => setEditableCustomer({ ...editableCustomer, city: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input type="text" className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.country || ""} onChange={(e) => setEditableCustomer({ ...editableCustomer, country: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.status} onChange={(e) => setEditableCustomer({ ...editableCustomer, status: e.target.value as "Active" | "Inactive" })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input type="text" className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" value={editableCustomer.address || ""} onChange={(e) => setEditableCustomer({ ...editableCustomer, address: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea className="w-full border rounded-md p-2 dark:bg-background-50 dark:border-background-400" rows={3} value={editableCustomer.notes || ""} onChange={(e) => setEditableCustomer({ ...editableCustomer, notes: e.target.value })} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-background-100 dark:hover:bg-background-200">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black shadow-sm">Save</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditCustomerModal;
