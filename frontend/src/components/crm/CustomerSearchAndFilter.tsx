import React from "react";
import { Search, X, Users } from "lucide-react";

interface CustomerSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onAddCustomer: () => void;
}

const CustomerSearchAndFilter: React.FC<CustomerSearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  onAddCustomer,
}) => {
  const hasActiveFilters = searchQuery || selectedStatus;

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("");
  };

  return (
    <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-400 dark:text-text-500" />
          <input
            type="text"
            placeholder="Search by name, email, organization..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-background-300 dark:border-background-400 rounded-lg bg-white dark:bg-background-50 text-text-900 dark:text-white placeholder-text-500 dark:placeholder-text-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-background-300 dark:border-background-400 rounded-lg bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-background-300 dark:border-background-400 rounded-lg bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-newest">Date Added (Newest)</option>
          <option value="date-oldest">Date Added (Oldest)</option>
          <option value="orders-most">Orders (Most)</option>
          <option value="orders-least">Orders (Least)</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}

        {/* Add Customer Button */}
        <button
          onClick={onAddCustomer}
          className="ml-auto px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Users className="w-4 h-4" />
          Add Customer
        </button>
      </div>
    </div>
  );
};

export default CustomerSearchAndFilter;
