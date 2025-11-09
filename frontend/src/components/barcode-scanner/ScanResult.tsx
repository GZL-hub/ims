import React from 'react';
import { CheckCircle, X, Package } from 'lucide-react';
import { getImageUrl } from '../../services/inventoryService';

interface ScanResultData {
  id: string;
  barcode: string;
  timestamp: Date;
  productName?: string;
  quantity?: number;
  image?: string;
  category?: string;
}

interface ScanResultProps {
  scan: ScanResultData;
  onClear: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ scan, onClear }) => {
  const imageUrl = getImageUrl(scan.image);

  return (
    <div className="bg-background-50 dark:bg-background-100 rounded-lg border-2 border-primary-300 dark:border-primary-400 overflow-hidden animate-slideIn">
      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border-b border-primary-200 dark:border-primary-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="font-semibold text-text-950 dark:text-white">Scan Result</h3>
        </div>
        <button
          onClick={onClear}
          className="p-1 hover:bg-primary-100 dark:hover:bg-primary-800 rounded transition-colors"
        >
          <X className="h-4 w-4 text-text-600 dark:text-text-400" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0 w-24 h-24 bg-background-200 dark:bg-background-300 rounded-lg flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={scan.productName || 'Product'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<svg class="h-12 w-12 text-text-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>';
                  }
                }}
              />
            ) : (
              <Package className="h-12 w-12 text-text-500 dark:text-text-400" />
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-text-950 dark:text-white mb-1">
              {scan.productName || 'Unknown Product'}
            </h4>
            <div className="space-y-2">
              {scan.category && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium">
                    {scan.category}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-600 dark:text-text-400">Barcode:</span>
                <span className="font-mono text-text-950 dark:text-text-50 bg-background-200 dark:bg-background-300 px-2 py-0.5 rounded">
                  {scan.barcode}
                </span>
              </div>
              {scan.quantity !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-600 dark:text-text-400">Stock:</span>
                  <span className={`font-semibold ${
                    scan.quantity > 50 ? 'text-green-600 dark:text-green-400' :
                    scan.quantity > 10 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {scan.quantity} units
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-text-600 dark:text-text-400">
                <span>Scanned:</span>
                <span>{scan.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-background-200 dark:border-background-300 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-primary-900 text-white rounded-lg hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black transition-colors font-medium">
            View Details
          </button>
          <button className="flex-1 px-4 py-2 bg-background-200 dark:bg-background-300 text-text-950 dark:text-text-50 rounded-lg hover:bg-background-300 dark:hover:bg-background-400 transition-colors font-medium">
            Edit Quantity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
