import React, { useEffect, useRef, useState } from 'react';
import { Camera, ScanBarcode, AlertCircle, XCircle } from 'lucide-react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface CameraScanModeProps {
  isScanning: boolean;
  onStartScan: () => void;
  onScanSuccess: (barcode: string) => void;
  onStopScan: () => void;
}

const CameraScanMode: React.FC<CameraScanModeProps> = ({
  isScanning,
  onStartScan,
  onScanSuccess,
  onStopScan
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize the code reader
    codeReaderRef.current = new BrowserMultiFormatReader();

    return () => {
      // Cleanup on unmount
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    const startScanningInternal = async () => {
      if (!codeReaderRef.current || !videoRef.current) return;

      try {
        setError(null);
        setHasPermission(null);

        // Request camera permission and start decoding
        await codeReaderRef.current.decodeFromVideoDevice(
          undefined, // Use default camera
          videoRef.current,
          (result, error) => {
            if (result) {
              // Barcode detected!
              const barcodeValue = result.getText();
              console.log('Barcode detected:', barcodeValue);
              onScanSuccess(barcodeValue);
              // Stop scanning after successful detection
              if (codeReaderRef.current) {
                codeReaderRef.current.reset();
              }
              onStopScan();
            }

            // Ignore NotFoundException (no barcode in frame yet)
            if (error && !(error instanceof NotFoundException)) {
              console.error('Scan error:', error);
            }
          }
        );

        setHasPermission(true);
      } catch (err) {
        console.error('Camera error:', err);
        setHasPermission(false);

        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera permission denied. Please allow camera access and try again.');
          } else if (err.name === 'NotFoundError') {
            setError('No camera found on this device.');
          } else {
            setError(`Camera error: ${err.message}`);
          }
        } else {
          setError('Failed to access camera. Please check your browser permissions.');
        }

        onStopScan();
      }
    };

    if (isScanning && videoRef.current && codeReaderRef.current) {
      startScanningInternal();
    } else if (!isScanning && codeReaderRef.current) {
      codeReaderRef.current.reset();
    }

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [isScanning, onScanSuccess, onStopScan]);

  const handleStartStop = () => {
    if (isScanning) {
      onStopScan();
    } else {
      onStartScan();
    }
  };

  return (
    <div className="bg-background-50 dark:bg-background-100 rounded-lg border-2 border-background-200 dark:border-background-300 overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-background-100 to-background-200 dark:from-background-100 dark:to-background-200 flex items-center justify-center">
        {/* Camera View */}
        {isScanning ? (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-96 h-32">
                {/* Scanning Frame - Rectangle for CODE128 */}
                <div className="absolute inset-0 border-4 border-primary-500 rounded-lg shadow-lg"></div>
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
              </div>
            </div>
            {/* Instructions Overlay */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="inline-block bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">Position barcode within the frame</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {error ? (
              <div className="text-center max-w-md px-4">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-text-950 dark:text-white mb-2">Camera Error</p>
                <p className="text-sm text-text-600 dark:text-text-400">{error}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-96 h-32 mx-auto mb-4 border-4 border-dashed border-background-300 dark:border-background-400 rounded-lg flex items-center justify-center">
                  <Camera className="h-16 w-16 text-text-400 dark:text-text-500" />
                </div>
                <p className="text-lg font-semibold text-text-950 dark:text-white">Ready to Scan</p>
                <p className="text-sm text-text-600 dark:text-text-400">Click the button below to start scanning</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-4 border-t border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100">
        <button
          onClick={handleStartStop}
          className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            isScanning
              ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
              : 'bg-primary-900 text-white hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black active:scale-95'
          }`}
        >
          {isScanning ? (
            <>
              <XCircle className="h-5 w-5" />
              Stop Scanning
            </>
          ) : (
            <>
              <ScanBarcode className="h-5 w-5" />
              Start Scan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraScanMode;
