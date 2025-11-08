import React, { useMemo } from "react";
import ReactDOM from "react-dom";
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
import { Edit, Trash2, ChevronUp, ChevronDown, Package, X } from "lucide-react";
import type { InventoryItem } from "../../services/inventoryService";
import { getImageUrl } from "../../services/inventoryService";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

const columnHelper = createColumnHelper<InventoryItem>();

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [zoomedImage, setZoomedImage] = React.useState<{ url: string; name: string } | null>(null);

  // Handle ESC key to close zoom modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedImage) {
        setZoomedImage(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [zoomedImage]);

  const columns = useMemo(
    () => [
      // Image Column
      columnHelper.accessor("image", {
        header: "Image",
        cell: (info) => {
          const imagePath = info.getValue();
          const imageUrl = getImageUrl(imagePath);
          const itemName = info.row.original.item_name;

          return (
            <div className="flex justify-center">
              <div
                className={`w-12 h-12 rounded-lg overflow-hidden bg-background-200 dark:bg-background-300 flex items-center justify-center ${imageUrl ? 'cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all' : ''}`}
                onClick={() => {
                  if (imageUrl) {
                    setZoomedImage({ url: imageUrl, name: itemName });
                  }
                }}
                title={imageUrl ? "Click to zoom" : "No image"}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={itemName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'w-full h-full flex items-center justify-center';
                        placeholder.innerHTML = '<svg class="w-6 h-6 text-text-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <Package className="w-6 h-6 text-text-500 dark:text-text-400" />
                )}
              </div>
            </div>
          );
        },
        enableSorting: false,
        size: 80,
      }),

      // Item Name Column
      columnHelper.accessor("item_name", {
        header: "Item Name",
        cell: (info) => (
          <div className="font-medium text-text-900 text-center">{info.getValue()}</div>
        ),
        size: 200,
      }),

      // Category Column
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <div className="flex justify-center">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium">
              {info.getValue()}
            </span>
          </div>
        ),
        size: 150,
      }),

      // Quantity Column
      columnHelper.accessor("quantity", {
        header: "Quantity",
        cell: (info) => (
          <div className="text-center font-semibold text-text-900">
            {info.getValue()}
          </div>
        ),
        size: 100,
      }),

      // Status Column
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const statusColors = {
            "In Stock": "text-green-600 bg-green-50",
            "Low Stock": "text-yellow-600 bg-yellow-50",
            "Expired": "text-red-600 bg-red-50",
          };
          const colorClass = statusColors[status as keyof typeof statusColors] || "text-text-600 bg-background-100";

          return (
            <div className="text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                {status}
              </span>
            </div>
          );
        },
        size: 120,
      }),

      // Last Updated Column
      columnHelper.accessor("last_updated", {
        header: "Last Updated",
        cell: (info) => {
          const date = info.getValue();
          return (
            <div className="text-center text-text-700 text-sm">
              {date ? new Date(date).toLocaleDateString() : "-"}
            </div>
          );
        },
        size: 130,
      }),

      // Actions Column
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onEdit(info.row.original)}
              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Edit item"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(info.row.original)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        size: 100,
      }),
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg overflow-hidden shadow-sm">
        {/* Table Container */}
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-background-200 dark:divide-background-300">
          <thead className="bg-background-50 dark:bg-background-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-center text-xs font-medium text-text-600 dark:text-text-400 uppercase tracking-wider cursor-pointer select-none hover:bg-background-200 dark:hover:bg-background-200 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.column.getSize() }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span className="text-primary-600">
                          {header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
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
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-text-600"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Package className="w-12 h-12 text-text-400" />
                    <p className="text-lg font-medium">No inventory items found</p>
                    <p className="text-sm">Click "Add Item" to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-background-50 dark:hover:bg-background-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {items.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-background-50 dark:bg-background-100 border-t border-background-200 dark:border-background-300">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-700">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                items.length
              )}{" "}
              of {items.length} items
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm font-medium text-text-900">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md hover:bg-background-100 dark:hover:bg-background-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Last
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-text-700">Items per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-background-300 dark:border-background-400 rounded-md bg-white dark:bg-background-50 focus:ring-2 focus:ring-primary-500"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      </div>

      {/* Image Zoom Modal - Rendered via Portal to avoid z-index/spacing issues */}
      {zoomedImage && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              title="Close (ESC)"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image title */}
            <div className="absolute -top-12 left-0 text-white font-medium text-lg">
              {zoomedImage.name}
            </div>

            {/* Zoomed image */}
            <div className="bg-white dark:bg-background-100 rounded-lg overflow-hidden shadow-2xl">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.name}
                className="w-full h-full object-contain max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Helper text */}
            <div className="text-center mt-4 text-white text-sm">
              Click outside or press ESC to close
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default InventoryTable;
