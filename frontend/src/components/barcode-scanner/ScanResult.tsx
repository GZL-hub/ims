import React from 'react';
import { CheckCircle, X, Package } from 'lucide-react';

interface ScanResultData {
  id: string;
  barcode: string;
  timestamp: Date;
  productName?: string;
  quantity?: number;
}

interface ScanResultProps {
  scan: ScanResultData;
  onClear: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ scan, onClear }) => {
  return (
    <div className="bg-background-50 rounded-lg border-2 border-primary-300 overflow-hidden animate-slideIn">
      <div className="p-4 bg-primary-50 border-b border-primary-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-text-950">Scan Result</h3>
        </div>
        <button
          onClick={onClear}
          className="p-1 hover:bg-primary-100 rounded transition-colors"
        >
          <X className="h-4 w-4 text-text-600" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-background-200 rounded-lg flex items-center justify-center">
            <Package className="h-8 w-8 text-text-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-text-950 mb-1">
              {scan.productName || 'Unknown Product'}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-text-600">Barcode:</span>
                <span className="font-mono text-text-950 bg-background-200 px-2 py-0.5 rounded">
                  {scan.barcode}
                </span>
              </div>
              {scan.quantity !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-600">Stock:</span>
                  <span className={`font-semibold ${
                    scan.quantity > 50 ? 'text-green-600' :
                    scan.quantity > 10 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {scan.quantity} units
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-text-600">
                <span>Scanned:</span>
                <span>{scan.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-background-200 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            View Details
          </button>
          <button className="flex-1 px-4 py-2 bg-background-200 text-text-950 rounded-lg hover:bg-background-300 transition-colors font-medium">
            Edit Quantity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
