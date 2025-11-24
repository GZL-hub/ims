import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Keyboard, Package } from 'lucide-react';
import CameraScanMode from '../components/barcode-scanner/CameraScanMode';
import ManualEntryMode from '../components/barcode-scanner/ManualEntryMode';
import ScanResult from '../components/barcode-scanner/ScanResult';
import { searchInventoryItems, getInventoryItemByBarcode } from '../services/inventoryService';
import type { InventoryItem } from '../services/inventoryService';

interface ScanResultData {
  id: string;
  barcode: string;
  timestamp: Date;
  productName?: string;
  quantity?: number;
  image?: string;
  category?: string;
}

const BarcodeScanner: React.FC = () => {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualInput, setManualInput] = useState('');
  const [currentScan, setCurrentScan] = useState<ScanResultData | null>(null);
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [suggestions, setSuggestions] = useState<InventoryItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus on input when switching to manual mode
  useEffect(() => {
    if (scanMode === 'manual') {
      // Stop scanning when switching to manual mode
      setIsScanning(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
          image: item.image,
          category: item.category,
        };

        setCurrentScan(newScan);
        setScannedItem(item);
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
      image: item.image,
      category: item.category,
    };

    setCurrentScan(newScan);
    setScannedItem(item);
    setManualInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleViewDetails = () => {
    if (currentScan) {
      // Navigate to inventory page with barcode in search
      navigate('/inventory', { state: { searchBarcode: currentScan.barcode } });
    }
  };

  const handleEditQuantity = () => {
    if (scannedItem) {
      // Navigate to inventory page with item to edit
      navigate('/inventory', { state: { editItem: scannedItem } });
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleCameraScanSuccess = async (barcode: string) => {
    console.log('Scanned barcode:', barcode);

    try {
      // Try to fetch item by exact barcode match
      const item = await getInventoryItemByBarcode(barcode);

      const newScan: ScanResultData = {
        id: Date.now().toString(),
        barcode: item.barcode,
        timestamp: new Date(),
        productName: item.item_name,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
      };

      setCurrentScan(newScan);
      setScannedItem(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      // Show "not found" message with the barcode
      const newScan: ScanResultData = {
        id: Date.now().toString(),
        barcode: barcode,
        timestamp: new Date(),
        productName: 'Item Not Found',
        quantity: 0,
      };
      setCurrentScan(newScan);
      setScannedItem(null);
      alert(`Barcode "${barcode}" was scanned but no matching item was found in inventory.`);
    }
  };

  const clearCurrentScan = () => {
    setCurrentScan(null);
    setScannedItem(null);
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
                ? 'bg-primary-900 text-white shadow-md'
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
                ? 'bg-primary-900 text-white shadow-md'
                : 'bg-background-100 text-text-700 hover:bg-background-200'
            }`}
          >
            <Keyboard className="h-4 w-4" />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Scanner Interface - 70% */}
        <div className="lg:col-span-7">
          {scanMode === 'camera' ? (
            <CameraScanMode
              isScanning={isScanning}
              onStartScan={handleStartScan}
              onStopScan={handleStopScan}
              onScanSuccess={handleCameraScanSuccess}
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
        </div>

        {/* Current Scan Result - 30% */}
        <div className="lg:col-span-3">
          {currentScan ? (
            <ScanResult
              scan={currentScan}
              onClear={clearCurrentScan}
              onViewDetails={handleViewDetails}
              onEditQuantity={handleEditQuantity}
            />
          ) : (
            <div className="bg-background-50 dark:bg-background-100 rounded-lg border-2 border-dashed border-background-300 dark:border-background-400 p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <Package className="w-16 h-16 text-text-400 dark:text-text-500 mb-4" />
              <p className="text-text-600 dark:text-text-400 font-medium">No scan result yet</p>
              <p className="text-sm text-text-500 dark:text-text-500 mt-2">
                Scan or enter a barcode to view item details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
