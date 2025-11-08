import React from 'react';
import { Keyboard, Search, Package } from 'lucide-react';
import type { InventoryItem } from '../../services/inventoryService';

interface ManualEntryModeProps {
  manualInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  suggestions: InventoryItem[];
  showSuggestions: boolean;
  onSelectSuggestion: (item: InventoryItem) => void;
  isSearching: boolean;
}

const ManualEntryMode: React.FC<ManualEntryModeProps> = ({
  manualInput,
  onInputChange,
  onSubmit,
  inputRef,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
  isSearching,
}) => {
  return (
    <div className="bg-background-50 dark:bg-background-100 rounded-lg border-2 border-background-200 dark:border-background-300 overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-background-100 to-background-200 dark:from-background-100 dark:to-background-200 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
              <Keyboard className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-text-950">Manual Entry</h3>
            <p className="text-sm text-text-600 mt-1">Type or paste the barcode number</p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={manualInput}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Enter barcode number..."
                className="w-full px-4 py-3 pr-12 bg-white border-2 border-background-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:bg-background-50 dark:border-background-300 dark:text-text-900 dark:placeholder-text-500 focus:ring-2 focus:ring-primary-200 transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-900 text-white rounded-md hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && manualInput.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-background-50 border-2 border-primary-300 dark:border-primary-400 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                  {isSearching ? (
                    <div className="p-4 text-center text-text-600">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                      <p className="text-sm mt-2">Searching...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="divide-y divide-background-200">
                      {suggestions.map((item) => (
                        <button
                          key={item._id}
                          type="button"
                          onClick={() => onSelectSuggestion(item)}
                          className="w-full p-3 hover:bg-primary-100 transition-colors text-left flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-background-200 rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-text-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-700 truncate text-sm">
                              {item.item_name}
                            </p>
                            <p className="text-xs font-mono text-text-600 truncate">
                              {item.barcode}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-text-500">{item.category}</span>
                              <span className={`text-xs font-medium ${
                                item.quantity > 50 ? 'text-green-600' :
                                item.quantity > 10 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {item.quantity} in stock
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center dark:bg-background-50">
                      <Package className="h-12 w-12 text-text-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-700">No items found</p>
                      <p className="text-xs text-text-500 mt-1">
                        Try a different search term
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryMode;
