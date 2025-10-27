import React, { useState, useEffect, useRef } from 'react';
import { Camera, Keyboard } from 'lucide-react';
import CameraScanMode from '../components/barcode-scanner/CameraScanMode';
import ManualEntryMode from '../components/barcode-scanner/ManualEntryMode';
import ScanResult from '../components/barcode-scanner/ScanResult';
import RecentScans from '../components/barcode-scanner/RecentScans';

interface ScanResultData {
  id: string;
  barcode: string;
  timestamp: Date;
  productName?: string;
  quantity?: number;
}

const BarcodeScanner: React.FC = () => {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualInput, setManualInput] = useState('');
  const [recentScans, setRecentScans] = useState<ScanResultData[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResultData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on input when switching to manual mode
  useEffect(() => {
    if (scanMode === 'manual' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanMode]);

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      const newScan: ScanResultData = {
        id: Date.now().toString(),
        barcode: manualInput.trim(),
        timestamp: new Date(),
        // Mock product data - will be replaced with actual backend call
        productName: `Product ${manualInput.slice(-4)}`,
        quantity: Math.floor(Math.random() * 100) + 1,
      };

      setCurrentScan(newScan);
      setRecentScans(prev => [newScan, ...prev.slice(0, 9)]);
      setManualInput('');
    }
  };

  const handleCameraScan = () => {
    setIsScanning(true);

    // Simulate camera scan - will be replaced with actual scanner integration
    setTimeout(() => {
      const mockBarcode = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const newScan: ScanResultData = {
        id: Date.now().toString(),
        barcode: mockBarcode,
        timestamp: new Date(),
        productName: `Product ${mockBarcode.slice(-4)}`,
        quantity: Math.floor(Math.random() * 100) + 1,
      };

      setCurrentScan(newScan);
      setRecentScans(prev => [newScan, ...prev.slice(0, 9)]);
      setIsScanning(false);
    }, 1500);
  };

  const clearCurrentScan = () => {
    setCurrentScan(null);
  };

  const clearHistory = () => {
    setRecentScans([]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Mode Selector */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-600">Scan or enter barcodes to lookup inventory items</p>

        {/* Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setScanMode('camera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              scanMode === 'camera'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-background-100 text-text-700 hover:bg-background-200'
            }`}
          >
            <Camera className="h-4 w-4" />
            Camera Scan
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              scanMode === 'manual'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-background-100 text-text-700 hover:bg-background-200'
            }`}
          >
            <Keyboard className="h-4 w-4" />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scanning Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scanner Interface */}
          {scanMode === 'camera' ? (
            <CameraScanMode
              isScanning={isScanning}
              onStartScan={handleCameraScan}
            />
          ) : (
            <ManualEntryMode
              manualInput={manualInput}
              onInputChange={setManualInput}
              onSubmit={handleManualScan}
              inputRef={inputRef}
            />
          )}

          {/* Current Scan Result */}
          {currentScan && (
            <ScanResult
              scan={currentScan}
              onClear={clearCurrentScan}
            />
          )}
        </div>

        {/* Recent Scans Sidebar */}
        <div className="lg:col-span-1">
          <RecentScans
            scans={recentScans}
            onClearHistory={clearHistory}
            onSelectScan={setCurrentScan}
          />
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
