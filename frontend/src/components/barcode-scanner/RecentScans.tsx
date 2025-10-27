import React from 'react';
import { History, AlertCircle, Package } from 'lucide-react';

interface ScanData {
  id: string;
  barcode: string;
  timestamp: Date;
  productName?: string;
  quantity?: number;
}

interface RecentScansProps {
  scans: ScanData[];
  onClearHistory: () => void;
  onSelectScan: (scan: ScanData) => void;
}

const RecentScans: React.FC<RecentScansProps> = ({ scans, onClearHistory, onSelectScan }) => {
  return (
    <div className="bg-background-50 rounded-lg border-2 border-background-200 overflow-hidden sticky top-6">
      <div className="p-4 border-b border-background-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-text-600" />
          <h3 className="font-semibold text-text-950">Recent Scans</h3>
        </div>
        {scans.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {scans.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-text-300 mx-auto mb-3" />
            <p className="text-sm text-text-600">No recent scans</p>
            <p className="text-xs text-text-500 mt-1">Scan a barcode to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-background-200">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="p-4 hover:bg-background-100 transition-colors cursor-pointer"
                onClick={() => onSelectScan(scan)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-background-200 rounded flex items-center justify-center">
                    <Package className="h-5 w-5 text-text-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-950 truncate">
                      {scan.productName || 'Unknown'}
                    </p>
                    <p className="text-xs font-mono text-text-600 truncate mt-0.5">
                      {scan.barcode}
                    </p>
                    <p className="text-xs text-text-500 mt-1">
                      {scan.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentScans;
