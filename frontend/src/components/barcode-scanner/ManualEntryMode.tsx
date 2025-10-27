import React from 'react';
import { Keyboard, Search } from 'lucide-react';

interface ManualEntryModeProps {
  manualInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ManualEntryMode: React.FC<ManualEntryModeProps> = ({
  manualInput,
  onInputChange,
  onSubmit,
  inputRef,
}) => {
  return (
    <div className="bg-background-50 rounded-lg border-2 border-background-200 overflow-hidden">
      <div className="relative aspect-video bg-gradient-to-br from-background-100 to-background-200 flex items-center justify-center p-8">
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
                className="w-full px-4 py-3 pr-12 bg-white border-2 border-background-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryMode;
