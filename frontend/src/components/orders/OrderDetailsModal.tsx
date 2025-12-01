import React from "react";
import ReactDOM from "react-dom";
import { X, Edit2, Trash2, User, Mail, Building, Phone, Calendar, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Order as OrderType } from "../../services/orderService";

interface OrderDetailsModalProps {
  order: OrderType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

const getStatusBadge = (status: string) => {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      icon: <Clock className="w-4 h-4" />,
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    cancelled: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  const s = status.toLowerCase();
  const style = styles[s];

  if (!style) return status;

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}
    >
      {style.icon}
      {status}
    </span>
  );
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
}) => {
  const isPending = order.status === "Pending";
  const isCompleted = order.status === "Completed";
  const isCancelled = order.status === "Cancelled";

  const sortedItems = React.useMemo(() => {
    return [...order.items].sort((a, b) =>
      a.itemName.localeCompare(b.itemName)
    );
  }, [order.items]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-100 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-background-200 dark:border-background-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white dark:bg-background-100 border-b border-background-200 dark:border-background-300 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-950 dark:text-white">Order Details</h2>
            <p className="text-text-600 dark:text-text-400 text-sm mt-1">
              ID: {order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <button
              onClick={onClose}
              className="p-2 hover:bg-background-100 dark:hover:bg-background-200 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-text-600" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-background-50 dark:bg-background-100 rounded-lg p-5 border border-background-200 dark:border-background-300">
            <h3 className="text-lg font-semibold text-text-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-text-500 mt-0.5" />
                <div>
                  <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Name</p>
                  <p className="text-sm font-medium text-text-900 dark:text-white mt-1">
                    {order.customer_name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-text-500 mt-0.5" />
                <div>
                  <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-text-900 dark:text-white mt-1">
                    {order.email || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-text-500 mt-0.5" />
                <div>
                  <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Organization</p>
                  <p className="text-sm font-medium text-text-900 dark:text-white mt-1">
                    {order.organization || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-text-500 mt-0.5" />
                <div>
                  <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-medium text-text-900 dark:text-white mt-1">
                    {order.phone || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Dates Card */}
          <div className="bg-background-50 dark:bg-background-100 rounded-lg p-5 border border-background-200 dark:border-background-300">
            <h3 className="text-lg font-semibold text-text-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Order Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Created</p>
                <p className="text-sm font-medium text-text-900 dark:text-white mt-1">
                  {new Date(order.date_created).toLocaleString()}
                </p>
              </div>
              {order.last_updated && (
                <div>
                  <p className="text-xs text-text-500 dark:text-text-400 uppercase tracking-wide">Last Updated</p>
                  <p className="text-sm font-medium text-text-900 dark:text-white mt-1">
                    {new Date(order.last_updated).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-background-50 dark:bg-background-100 rounded-lg p-5 border border-background-200 dark:border-background-300">
            <h3 className="text-lg font-semibold text-text-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Order Items ({order.items.length})
            </h3>
            <div className="overflow-hidden border border-background-200 dark:border-background-300 rounded-lg">
              <table className="min-w-full divide-y divide-background-200 dark:divide-background-300">
                <thead className="bg-background-100 dark:bg-background-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-700 dark:text-text-300 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-700 dark:text-text-300 uppercase tracking-wider">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-background-50 divide-y divide-background-200 dark:divide-background-300">
                  {sortedItems.map((item, index) => (
                    <tr key={index} className="hover:bg-background-50 dark:hover:bg-background-100 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-text-900 dark:text-white">
                        {item.itemName}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-text-700 dark:text-text-300">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold">
                          {item.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-background-50 dark:bg-background-100 px-6 py-4 border-t border-background-200 dark:border-background-300 flex flex-wrap gap-3 justify-end">
          {/* Edit - Only for pending orders */}
          {isPending && (
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2 shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Order
            </button>
          )}

          {/* Complete - Only for pending orders */}
          {isPending && (
            <button
              onClick={onComplete}
              className="px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition flex items-center gap-2 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </button>
          )}

          {/* Cancel - Only for pending orders */}
          {isPending && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 transition flex items-center gap-2 shadow-sm"
            >
              <XCircle className="w-4 h-4" />
              Cancel Order
            </button>
          )}

          {/* Delete - For completed or cancelled orders */}
          {(isCompleted || isCancelled) && (
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Order
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailsModal;
