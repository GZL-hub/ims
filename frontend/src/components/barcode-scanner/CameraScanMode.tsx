import React from 'react';
import { Camera, ScanBarcode } from 'lucide-react';

interface CameraScanModeProps {
  isScanning: boolean;
  onStartScan: () => void;
}

const CameraScanMode: React.FC<CameraScanModeProps> = ({ isScanning, onStartScan }) => {
  return (
    <div className="bg-background-50 dark:bg-background-100 rounded-lg border-2 border-background-200 dark:border-background-300 overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-background-100 to-background-200 dark:from-background-100 dark:to-background-200 flex items-center justify-center">
        {/* Camera View Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isScanning ? (
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-4">
                {/* Scanning Animation */}
                <div className="absolute inset-0 border-4 border-primary-600 rounded-lg"></div>
                <div className="absolute inset-0 border-4 border-primary-400 rounded-lg animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanBarcode className="h-24 w-24 text-primary-600" />
                </div>
                {/* Scanning Line */}
                <div className="absolute left-0 right-0 h-1 bg-primary-500 shadow-lg shadow-primary-500/50 animate-scan"></div>
              </div>
              <p className="text-lg font-semibold text-text-950">Scanning...</p>
              <p className="text-sm text-text-600">Position barcode within the frame</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-4 border-4 border-dashed border-background-300 rounded-lg flex items-center justify-center">
                <Camera className="h-24 w-24 text-text-400" />
              </div>
              <p className="text-lg font-semibold text-text-950">Ready to Scan</p>
              <p className="text-sm text-text-600">Click the button below to start scanning</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 border-t border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100">
        <button
          onClick={onStartScan}
          disabled={isScanning}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            isScanning
              ? 'bg-background-300 dark:bg-background-200 text-text-500 cursor-not-allowed'
              : 'bg-primary-900 text-white hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black active:scale-95'
          }`}
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </button>
      </div>
    </div>
  );
};

export default CameraScanMode;
