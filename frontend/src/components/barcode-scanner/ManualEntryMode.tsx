import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Keyboard, Search, Package } from 'lucide-react';
import type { InventoryItem } from '../../services/inventoryService';
import { getImageUrl } from '../../services/inventoryService';

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
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Calculate dropdown position when suggestions are shown
  useEffect(() => {
    if (showSuggestions && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [showSuggestions, manualInput]);

  return (
    <>
      <div className="bg-background-50 dark:bg-background-100 rounded-lg border-2 border-background-200 dark:border-background-300 overflow-visible">
        <div className="relative aspect-video bg-gradient-to-br from-background-100 to-background-200 dark:from-background-100 dark:to-background-200 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
                <Keyboard className="h-10 w-10 text-primary-600 dark:text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-text-950 dark:text-white">Manual Entry</h3>
              <p className="text-sm text-text-600 dark:text-text-400 mt-1">Type or paste the barcode number</p>
            </div>
            <form onSubmit={onSubmit}>
              <div ref={inputContainerRef} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={manualInput}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Enter barcode number..."
                  className="w-full px-4 py-3 pr-12 bg-white border-2 border-background-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 dark:bg-background-50 dark:border-background-400 dark:text-text-900 dark:placeholder-text-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-900 text-white rounded-md hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search Suggestions Dropdown - Rendered via Portal */}
      {showSuggestions && manualInput.trim().length > 0 && ReactDOM.createPortal(
        <div
          className="fixed bg-white dark:bg-background-50 border-2 border-primary-300 dark:border-primary-400 rounded-lg shadow-xl max-h-96 overflow-y-auto z-[150]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          {isSearching ? (
            <div className="p-6 text-center text-text-600 dark:text-text-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-sm mt-3 font-medium">Searching inventory...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="divide-y divide-background-200 dark:divide-background-300">
              {suggestions.map((item) => {
                const imageUrl = getImageUrl(item.image);
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => onSelectSuggestion(item)}
                    className="w-full p-4 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left flex items-center gap-4"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-16 h-16 bg-background-200 dark:bg-background-300 rounded-lg overflow-hidden flex items-center justify-center">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.item_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<svg class="h-8 w-8 text-text-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                            }
                          }}
                        />
                      ) : (
                        <Package className="h-8 w-8 text-text-500 dark:text-text-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-900 dark:text-white truncate">
                        {item.item_name}
                      </p>
                      <p className="text-xs font-mono text-text-600 dark:text-text-400 mt-1">
                        {item.barcode}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                          {item.category}
                        </span>
                        <span className={`text-xs font-semibold ${
                          item.quantity > 50 ? 'text-green-600 dark:text-green-400' :
                          item.quantity > 10 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {item.quantity} in stock
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package className="h-16 w-16 text-text-300 dark:text-text-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-text-700 dark:text-text-300">No items found</p>
              <p className="text-xs text-text-500 dark:text-text-400 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default ManualEntryMode;
