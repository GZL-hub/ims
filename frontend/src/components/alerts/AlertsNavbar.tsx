import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { AlertStats } from '../../services/alertsService';

interface AlertsNavbarProps {
  stats: AlertStats;
  filter: 'all' | 'critical' | 'warning' | 'low-stock' | 'out-of-stock';
  onFilterChange: (filter: 'all' | 'critical' | 'warning' | 'low-stock' | 'out-of-stock') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const AlertsNavbar: React.FC<AlertsNavbarProps> = ({
  stats,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <div className="bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 rounded-lg shadow-sm">
      {/* Filter Buttons Row */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-background-200 dark:border-background-300 overflow-x-auto">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'all'
              ? 'bg-primary-900 dark:bg-primary-600 text-white dark:text-black'
              : 'bg-white dark:bg-background-50 text-text-700 dark:text-text-300 hover:bg-background-100 dark:hover:bg-background-200 border border-background-300 dark:border-background-400'
          }`}
        >
          All <span className="ml-1.5 font-semibold">({stats.total})</span>
        </button>
        <button
          onClick={() => onFilterChange('out-of-stock')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'out-of-stock'
              ? 'bg-gray-600 text-white'
              : 'bg-white dark:bg-background-50 text-text-700 dark:text-text-300 hover:bg-background-100 dark:hover:bg-background-200 border border-background-300 dark:border-background-400'
          }`}
        >
          Out of Stock <span className="ml-1.5 font-semibold">({stats.outOfStock})</span>
        </button>
        <button
          onClick={() => onFilterChange('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'critical'
              ? 'bg-red-600 text-white'
              : 'bg-white dark:bg-background-50 text-text-700 dark:text-text-300 hover:bg-background-100 dark:hover:bg-background-200 border border-background-300 dark:border-background-400'
          }`}
        >
          Critical <span className="ml-1.5 font-semibold">({stats.critical})</span>
        </button>
        <button
          onClick={() => onFilterChange('warning')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'warning'
              ? 'bg-yellow-600 text-white'
              : 'bg-white dark:bg-background-50 text-text-700 dark:text-text-300 hover:bg-background-100 dark:hover:bg-background-200 border border-background-300 dark:border-background-400'
          }`}
        >
          Warning <span className="ml-1.5 font-semibold">({stats.warning})</span>
        </button>
        <button
          onClick={() => onFilterChange('low-stock')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'low-stock'
              ? 'bg-orange-600 text-white'
              : 'bg-white dark:bg-background-50 text-text-700 dark:text-text-300 hover:bg-background-100 dark:hover:bg-background-200 border border-background-300 dark:border-background-400'
          }`}
        >
          Low Stock <span className="ml-1.5 font-semibold">({stats.lowStock})</span>
        </button>
      </div>

      {/* Search and Category Filter Row */}
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-400 dark:text-text-500" />
          <input
            type="text"
            placeholder="Search alerts by item name or barcode..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-background-50 border border-background-300 dark:border-background-400 rounded-lg text-text-900 dark:text-white placeholder-text-500 dark:placeholder-text-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 transition-colors"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-400 dark:text-text-500 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-background-50 border border-background-300 dark:border-background-400 rounded-lg text-text-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-text-400 dark:text-text-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsNavbar;
