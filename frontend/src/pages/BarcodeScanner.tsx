import React, { useState, useEffect, useRef } from 'react';
import { Camera, Keyboard } from 'lucide-react';
import CameraScanMode from '../components/barcode-scanner/CameraScanMode';
import ManualEntryMode from '../components/barcode-scanner/ManualEntryMode';
import ScanResult from '../components/barcode-scanner/ScanResult';
import RecentScans from '../components/barcode-scanner/RecentScans';
import { searchInventoryItems, getInventoryItemByBarcode } from '../services/inventoryService';
import type { InventoryItem } from '../services/inventoryService';

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
  const [suggestions, setSuggestions] = useState<InventoryItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus on input when switching to manual mode
  useEffect(() => {
    if (scanMode === 'manual' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [scanMode]);

  // Search for items as user types (debounced)
  useEffect(() => {
    if (manualInput.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      setShowSuggestions(true);

      try {
        const items = await searchInventoryItems(manualInput.trim());
        setSuggestions(items);
      } catch (error) {
        console.error('Error searching items:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [manualInput]);

  const handleManualScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setShowSuggestions(false);

      try {
        // Try to fetch item by exact barcode match
        const item = await getInventoryItemByBarcode(manualInput.trim());

        const newScan: ScanResultData = {
          id: Date.now().toString(),
          barcode: item.barcode,
          timestamp: new Date(),
          productName: item.item_name,
          quantity: item.quantity,
        };

        setCurrentScan(newScan);
        setRecentScans(prev => [newScan, ...prev.slice(0, 9)]);
        setManualInput('');
        setSuggestions([]);
      } catch (error) {
        console.error('Error fetching item:', error);
        // Show error or "not found" message
        alert('Item not found. Please try a different barcode.');
      }
    }
  };

  const handleSelectSuggestion = (item: InventoryItem) => {
    const newScan: ScanResultData = {
      id: Date.now().toString(),
      barcode: item.barcode,
      timestamp: new Date(),
      productName: item.item_name,
      quantity: item.quantity,
    };

    setCurrentScan(newScan);
    setRecentScans(prev => [newScan, ...prev.slice(0, 9)]);
    setManualInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleCameraScan = () => {
    // TODO: Implement camera scanning with actual barcode scanner library
    alert('Camera scanning is not yet implemented. Please use Manual Entry mode.');
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
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              onSelectSuggestion={handleSelectSuggestion}
              isSearching={isSearching}
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
