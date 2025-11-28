import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react";
import { updateOrder, deleteOrder, type Order as OrderType } from "../../services/orderService";
import EditOrderModal from "./EditOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmDialog from "../common/ConfirmDialog";

interface OrdersTableProps {
  orders: OrderType[];
  setOrders: React.Dispatch<React.SetStateAction<OrderType[]>>;
  onShowSuccess?: (message: string) => void;
}

const columnHelper = createColumnHelper<OrderType>();

const statusLabelMap: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

const getStatusBadge = (status: string) => {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      icon: <Clock className="w-3 h-3" />,
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    cancelled: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const s = status.toLowerCase();
  const style = styles[s];

  if (!style) return status;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {style.icon}
      {statusLabelMap[s] ?? status}
    </span>
  );
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, setOrders, onShowSuccess }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedOrder, setExpandedOrder] = useState<OrderType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableOrder, setEditableOrder] = useState<OrderType | null>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "complete" | "cancel" | "delete" | null;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Open edit modal
  const handleEditClick = () => {
    if (expandedOrder) {
      setEditableOrder(expandedOrder);
      setIsEditing(true);
      setExpandedOrder(null);
    }
  };

  // Complete order with confirmation
  const handleCompleteOrder = () => {
    if (!expandedOrder) return;

    setConfirmDialog({
      isOpen: true,
      type: "complete",
      title: "Complete Order",
      message: `Are you sure you want to mark this order as completed? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const updatedOrder = await updateOrder(expandedOrder._id, { status: "Completed" });
          setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
          setExpandedOrder(null);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          onShowSuccess?.("Order marked as completed successfully!");
        } catch (err: any) {
          console.error(err);
          alert(err.response?.data?.message || "Error completing order");
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      },
    });
  };

  // Cancel order with confirmation
  const handleCancelOrder = () => {
    if (!expandedOrder) return;

    setConfirmDialog({
      isOpen: true,
      type: "cancel",
      title: "Cancel Order",
      message: `Are you sure you want to cancel this order? The inventory will be restored.`,
      onConfirm: async () => {
        try {
          const updatedOrder = await updateOrder(expandedOrder._id, { status: "Cancelled" });
          setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
          setExpandedOrder(null);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          onShowSuccess?.("Order cancelled successfully!");
        } catch (err: any) {
          console.error(err);
          alert(err.response?.data?.message || "Error cancelling order");
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      },
    });
  };

  // Delete order with confirmation
  const handleDeleteOrder = () => {
    if (!expandedOrder) return;

    setConfirmDialog({
      isOpen: true,
      type: "delete",
      title: "Delete Order",
      message: `Are you sure you want to permanently delete this order? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteOrder(expandedOrder._id);
          setOrders((prev) => prev.filter((o) => o._id !== expandedOrder._id));
          setExpandedOrder(null);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          onShowSuccess?.("Order deleted successfully!");
        } catch (err: any) {
          console.error(err);
          alert(err.response?.data?.message || "Error deleting order");
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      },
    });
  };

  // Save handler for edit modal
  const handleSaveEdit = async (updatedOrder: OrderType) => {
    try {
      const updated = await updateOrder(updatedOrder._id, updatedOrder);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setEditableOrder(null);
      setIsEditing(false);
      onShowSuccess?.("Order updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating order");
    }
  };

  // Columns
  const columns = useMemo(() => [
    columnHelper.accessor("_id", {
      header: "Order ID",
      cell: (info) => (
        <div className="text-center font-mono text-xs text-text-700 dark:text-text-300">
          {info.getValue().slice(-6).toUpperCase()}
        </div>
      ),
      size: 100,
    }),
    columnHelper.accessor("customer_name", {
      header: "Customer",
      cell: (info) => (
        <div className="text-center font-mono text-xs text-text-700 dark:text-text-300">
          {info.getValue()}
        </div>
      ),
      size: 180,
    }),
    columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => (
            <div className="text-center text-sm text-text-700 dark:text-text-300">
            {info.getValue() || "-"}
            </div>
        ),
        size: 200,
        }),
    columnHelper.accessor("organization", {
        header: "Organization",
        cell: (info) => (
            <div className="text-center text-sm text-text-700 dark:text-text-300">
            {info.getValue() || "-"}
            </div>
        ),
        size: 180,
    }),
    columnHelper.accessor("phone", {
        header: "Phone",
        cell: (info) => (
            <div className="text-center text-sm text-text-700 dark:text-text-300">
            {info.getValue() || "-"}
            </div>
        ),
        size: 140,
    }),
    columnHelper.accessor("items", {
      header: "Items",
      cell: (info) => {
        const items = info.getValue();
        if (!items || items.length === 0) return "No items";

        // Show first 3 items, then "+N more" if many
        const displayItems =
            items.length <= 3
                ? items.map((item: OrderType["items"][number]) => `${item.quantity} x ${item.itemName}`)
                : [
                    ...items
                    .slice(0, 3)
                    .map((item: OrderType["items"][number]) => `${item.quantity} x ${item.itemName}`),
                    `+${items.length - 3} more`,
                ];

        return (
          <div className="text-center text-sm text-text-700 dark:text-text-300">
            {displayItems.join(", ")}
          </div>
        );
      },
      size: 250,
    }),
    columnHelper.accessor("date_created", {
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <div className="text-center text-sm text-text-700 dark:text-text-300">
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        );
      },
      size: 140,
    }),
    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
            <div className="text-center">
            {getStatusBadge(info.getValue())}
            </div>
        ),
        size: 120,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setExpandedOrder(info.row.original)}
            className="px-2 py-1 text-primary-600 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors text-sm"
          >
            View
          </button>
        </div>
      ),
      size: 100,
    }),
  ], []);

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <>
      <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-background-200 dark:divide-background-300">
            <thead className="bg-background-50 dark:bg-background-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-center text-xs font-medium text-text-600 dark:text-text-400 uppercase tracking-wider cursor-pointer select-none hover:bg-background-200 dark:hover:bg-background-200 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: header.column.getSize() }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && (
                          <span className="text-primary-600">
                            {header.column.getIsSorted() === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-background-200 dark:divide-background-300 bg-white dark:bg-background-50">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-text-600">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="w-12 h-12 text-text-400" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm">Add a new order to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-background-50 dark:hover:bg-background-100 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-background-50 dark:bg-background-100 border-t border-background-200 dark:border-background-300">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-700">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  orders.length
                )} of {orders.length} orders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">First</button>
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
              <span className="px-3 py-1 text-sm font-medium text-text-900">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
              <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Last</button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {expandedOrder && (
        <OrderDetailsModal
          order={expandedOrder}
          onClose={() => setExpandedOrder(null)}
          onEdit={handleEditClick}
          onDelete={handleDeleteOrder}
          onComplete={handleCompleteOrder}
          onCancel={handleCancelOrder}
        />
      )}

      {/* Edit Order Modal */}
      {isEditing && editableOrder && (
        <EditOrderModal
          order={editableOrder}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={
          confirmDialog.type === "delete"
            ? "danger"
            : confirmDialog.type === "cancel"
            ? "warning"
            : "success"
        }
        confirmText={
          confirmDialog.type === "delete"
            ? "Delete"
            : confirmDialog.type === "cancel"
            ? "Cancel Order"
            : "Complete"
        }
        cancelText="Go Back"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </>
  );
};

export default OrdersTable;