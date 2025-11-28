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
import { ChevronUp, ChevronDown, Users, CheckCircle, XCircle } from "lucide-react";
import { updateCustomer, deleteCustomer, type Customer as CustomerType } from "../../services/customerService";
import CustomerDetailsModal from "./CustomerDetailsModal";
import EditCustomerModal from "./EditCustomerModal";
import ConfirmDialog from "../common/ConfirmDialog";

interface CustomerTableProps {
  customers: CustomerType[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>;
  onShowSuccess?: (message: string) => void;
}

const columnHelper = createColumnHelper<CustomerType>();

const getStatusBadge = (status: string) => {
  const styles = {
    Active: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    Inactive: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const style = styles[status as keyof typeof styles];
  if (!style) return status;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {style.icon}
      {status}
    </span>
  );
};

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, setCustomers, onShowSuccess }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedCustomer, setExpandedCustomer] = useState<CustomerType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableCustomer, setEditableCustomer] = useState<CustomerType | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | null;
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

  const handleEditClick = () => {
    if (expandedCustomer) {
      setEditableCustomer(expandedCustomer);
      setIsEditing(true);
      setExpandedCustomer(null);
    }
  };

  const handleDeleteCustomer = () => {
    if (!expandedCustomer) return;

    setConfirmDialog({
      isOpen: true,
      type: "delete",
      title: "Delete Customer",
      message: `Are you sure you want to permanently delete ${expandedCustomer.customer_name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteCustomer(expandedCustomer._id);
          setCustomers((prev) => prev.filter((c) => c._id !== expandedCustomer._id));
          setExpandedCustomer(null);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          onShowSuccess?.("Customer deleted successfully!");
        } catch (err: any) {
          console.error(err);
          alert(err.response?.data?.message || "Error deleting customer");
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      },
    });
  };

  const handleSaveEdit = async (updatedCustomer: CustomerType) => {
    try {
      const updated = await updateCustomer(updatedCustomer._id, updatedCustomer);
      setCustomers((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setEditableCustomer(null);
      setIsEditing(false);
      onShowSuccess?.("Customer updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating customer");
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor("customer_name", {
      header: "Name",
      cell: (info) => (
        <div className="text-center font-medium text-text-900 dark:text-white">
          {info.getValue()}
        </div>
      ),
      size: 180,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <div className="text-center text-sm text-text-700 dark:text-text-300">
          {info.getValue()}
        </div>
      ),
      size: 220,
    }),
    columnHelper.accessor("organization", {
      header: "Organization",
      cell: (info) => (
        <div className="text-center text-sm text-text-700 dark:text-text-300">
          {info.getValue()}
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
    columnHelper.accessor("city", {
      header: "City",
      cell: (info) => (
        <div className="text-center text-sm text-text-700 dark:text-text-300">
          {info.getValue() || "-"}
        </div>
      ),
      size: 120,
    }),
    columnHelper.accessor("total_orders", {
      header: "Orders",
      cell: (info) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold text-xs">
            {info.getValue() || 0}
          </span>
        </div>
      ),
      size: 100,
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
            onClick={() => setExpandedCustomer(info.row.original)}
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
    data: customers,
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
                      <Users className="w-12 h-12 text-text-400" />
                      <p className="text-lg font-medium">No customers found</p>
                      <p className="text-sm">Add a new customer to get started.</p>
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

        {customers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-background-50 dark:bg-background-100 border-t border-background-200 dark:border-background-300">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-700">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, customers.length)} of {customers.length} customers
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

      {expandedCustomer && (
        <CustomerDetailsModal
          customer={expandedCustomer}
          onClose={() => setExpandedCustomer(null)}
          onEdit={handleEditClick}
          onDelete={handleDeleteCustomer}
        />
      )}

      {isEditing && editableCustomer && (
        <EditCustomerModal
          customer={editableCustomer}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEdit}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </>
  );
};

export default CustomerTable;
