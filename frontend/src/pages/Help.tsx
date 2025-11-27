import React, { useState } from 'react';
import {
  Package,
  ScanBarcode,
  Accessibility,
  ArrowLeft,
  Search,
  Sparkles,
  ArrowRight,
  Plus,
  Edit,
  Eye,
  Camera,
  Keyboard,
  ChevronRight
} from 'lucide-react';

type ViewType = 'home' | 'getting-started' | 'inventory' | 'scanner' | 'accessibility';

const Help: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [searchQuery, setSearchQuery] = useState('');

  if (currentView !== 'home') {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-text-600 dark:text-text-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back to Help Center</span>
        </button>

        {/* Documentation Content */}
        <div className="bg-background-50 dark:bg-background-100 rounded-lg border border-background-200 dark:border-background-300 p-8">
          {currentView === 'getting-started' && <GettingStartedDocs />}
          {currentView === 'inventory' && <InventoryDocs />}
          {currentView === 'scanner' && <ScannerDocs />}
          {currentView === 'accessibility' && <AccessibilityDocs />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-950 dark:text-white mb-2">Need Assistance?</h1>
        <p className="text-text-600 dark:text-text-400">Search our documentation or browse topics below</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-background-50 border-2 border-background-300 dark:border-background-400 rounded-xl text-text-900 dark:text-white placeholder-text-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all text-lg"
          />
        </div>
      </div>

      {/* Help Topic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Getting Started Card */}
        <HelpCard
          icon={<Sparkles className="h-8 w-8" />}
          title="Getting Started"
          description="New to the system? Learn the basics and get up to speed quickly."
          color="blue"
          onClick={() => setCurrentView('getting-started')}
        />

        {/* Inventory Card */}
        <HelpCard
          icon={<Package className="h-8 w-8" />}
          title="Inventory Management"
          description="Add, edit, and manage your inventory items with images and barcodes."
          color="green"
          onClick={() => setCurrentView('inventory')}
        />

        {/* Barcode Scanner Card */}
        <HelpCard
          icon={<ScanBarcode className="h-8 w-8" />}
          title="Barcode Scanner"
          description="Scan barcodes with your camera or enter them manually to find items."
          color="purple"
          onClick={() => setCurrentView('scanner')}
        />

        {/* Accessibility Card */}
        <HelpCard
          icon={<Accessibility className="h-8 w-8" />}
          title="Accessibility & Settings"
          description="Keyboard shortcuts, themes, and accessibility features."
          color="orange"
          onClick={() => setCurrentView('accessibility')}
        />
      </div>
    </div>
  );
};

// Help Card Component
interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  onClick: () => void;
}

const HelpCard: React.FC<HelpCardProps> = ({ icon, title, description, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400',
  };

  return (
    <button
      onClick={onClick}
      className="group relative bg-white dark:bg-background-50 border-2 border-background-200 dark:border-background-300 rounded-xl p-6 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-200 text-left"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-3 rounded-lg border-2 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-text-950 dark:text-white mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <p className="text-text-600 dark:text-text-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <ArrowRight className="flex-shrink-0 h-5 w-5 text-text-400 group-hover:text-primary-600 dark:group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );
};

// Getting Started Documentation
const GettingStartedDocs: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-text-950 dark:text-white mb-3">Getting Started</h2>
        <p className="text-lg text-text-600 dark:text-text-400">
          Welcome to the Inventory Management System! This guide will help you get started.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h3 className="text-2xl font-semibold text-text-900 dark:text-white mt-8 mb-4">Quick Overview</h3>
        <p className="text-text-700 dark:text-text-300">
          The IMS is designed to help you efficiently manage inventory, track stock levels, and scan barcodes.
          Here's what you can do:
        </p>
        <ul className="space-y-2 text-text-700 dark:text-text-300">
          <li><strong>Manage Inventory:</strong> Add, edit, and delete products with images and details</li>
          <li><strong>Scan Barcodes:</strong> Use your camera or enter codes manually to find items</li>
          <li><strong>Track Stock:</strong> Monitor quantities and get low-stock alerts</li>
          <li><strong>View Reports:</strong> Analyze inventory data and trends</li>
        </ul>

        <h3 className="text-2xl font-semibold text-text-900 dark:text-white mt-8 mb-4">First Steps</h3>
        <ol className="space-y-3 text-text-700 dark:text-text-300 list-decimal list-inside">
          <li><strong>Add Your First Item:</strong> Navigate to Inventory and click "Add Item"</li>
          <li><strong>Upload Product Images:</strong> Add photos to make items easy to identify</li>
          <li><strong>Enter Barcodes:</strong> Include barcodes for quick scanning</li>
          <li><strong>Set Low Stock Alerts:</strong> Configure thresholds to prevent stockouts</li>
          <li><strong>Try Scanning:</strong> Test the barcode scanner with your items</li>
        </ol>

        <h3 className="text-2xl font-semibold text-text-900 dark:text-white mt-8 mb-4">Navigation</h3>
        <p className="text-text-700 dark:text-text-300">
          Use the sidebar on the left to navigate between different sections:
        </p>
        <ul className="space-y-2 text-text-700 dark:text-text-300">
          <li><strong>Dashboard:</strong> Overview of your inventory</li>
          <li><strong>Inventory:</strong> Manage all products</li>
          <li><strong>Barcode Scanner:</strong> Scan items quickly</li>
          <li><strong>Reports:</strong> View analytics and insights</li>
          <li><strong>Help:</strong> Access this documentation</li>
          <li><strong>Settings:</strong> Configure your preferences</li>
        </ul>
      </div>
    </div>
  );
};

// Inventory Documentation
const InventoryDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-950 dark:text-white mb-2">Inventory Management</h2>
        <p className="text-text-600 dark:text-text-400">
          Learn how to manage your inventory items, add products, and track stock levels.
        </p>
      </div>

      {/* Adding Items */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Adding Items</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ol className="list-decimal list-inside space-y-2 text-text-700 dark:text-text-300">
            <li>Navigate to the <strong>Inventory</strong> page from the sidebar</li>
            <li>Click the <strong>"Add Item"</strong> button in the top right</li>
            <li>Fill in the required fields:
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li><strong>Item Name:</strong> Product name (required)</li>
                <li><strong>Category:</strong> Select from predefined categories (required)</li>
                <li><strong>Quantity:</strong> Current stock count (required)</li>
                <li><strong>Barcode:</strong> Product barcode (optional - see barcode preview below)</li>
                <li><strong>Expiry Date:</strong> For perishable items (optional)</li>
                <li><strong>Low Stock Threshold:</strong> Alert level (default: 10)</li>
                <li><strong>Image:</strong> Product photo (PNG, JPG, GIF up to 5MB)</li>
              </ul>
            </li>
            <li>Review the barcode preview if you entered a barcode</li>
            <li>Click <strong>"Add Item"</strong> to save</li>
          </ol>
        </div>
      </div>

      {/* Searching & Filtering */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Searching & Filtering</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ul className="space-y-2 text-text-700 dark:text-text-300">
            <li><strong>Search Bar:</strong> Find items by name, barcode, category, or ID</li>
            <li><strong>Category Filter:</strong> Show only items in specific categories</li>
            <li><strong>Status Filter:</strong> Filter by In Stock, Low Stock, or Expired</li>
            <li><strong>Sort Options:</strong>
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Name (A-Z or Z-A)</li>
                <li>Quantity (Low to High or High to Low)</li>
                <li>Date Added (Newest or Oldest)</li>
                <li>Expiry Date (Soonest or Latest)</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Editing Items */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Edit className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Editing Items</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ul className="space-y-2 text-text-700 dark:text-text-300">
            <li>Click the <strong>Edit icon</strong> (pencil) in the Actions column</li>
            <li>Modify any field including quantity and images</li>
            <li>Click <strong>"Update Item"</strong> to save changes</li>
            <li><em>Note:</em> Uploading a new image will replace the existing one</li>
          </ul>
        </div>
      </div>

      {/* Barcode Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Barcode Visualization</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ul className="space-y-2 text-text-700 dark:text-text-300">
            <li>Click <strong>"Show"</strong> in the Barcode column to view full barcode</li>
            <li>Barcode popup displays the visual barcode and value</li>
            <li>Support for CODE128, EAN13, UPC, and other formats</li>
            <li>Preview barcodes in Add/Edit modals before saving</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Scanner Documentation
const ScannerDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-950 dark:text-white mb-2">Barcode Scanner</h2>
        <p className="text-text-600 dark:text-text-400">
          Learn how to scan barcodes using your camera or enter them manually.
        </p>
      </div>

      {/* Camera Scanning */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Camera Scanning</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ol className="list-decimal list-inside space-y-2 text-text-700 dark:text-text-300">
            <li>Navigate to <strong>Barcode Scanner</strong> from the sidebar</li>
            <li>Ensure <strong>"Camera Scan"</strong> mode is selected</li>
            <li>Click <strong>"Start Scan"</strong> button</li>
            <li>Allow camera access when prompted by your browser</li>
            <li>Position the barcode within the <strong>rectangular scanning frame</strong></li>
            <li>Hold steady until the barcode is detected (auto-stops on success)</li>
            <li>View item details in the scan result panel on the right</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> Works best with CODE128 barcodes. Ensure good lighting and hold the barcode flat.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Keyboard className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Manual Entry</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ol className="list-decimal list-inside space-y-2 text-text-700 dark:text-text-300">
            <li>Click the <strong>"Manual Entry"</strong> tab</li>
            <li>Type or paste the barcode number in the search field</li>
            <li>View <strong>search suggestions</strong> with product images as you type</li>
            <li>Click a suggestion to select it, or press Enter to search</li>
            <li>Item details appear in the scan result panel</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> The search also matches item names and categories, not just barcodes.
            </p>
          </div>
        </div>
      </div>

      {/* Using Scan Results */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Using Scan Results</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <p className="text-text-700 dark:text-text-300 mb-3">
            After scanning or finding an item, you have two action options:
          </p>
          <ul className="space-y-2 text-text-700 dark:text-text-300">
            <li><strong>View Details:</strong> Navigate to the Inventory page with the item highlighted in search</li>
            <li><strong>Edit Quantity:</strong> Navigate to Inventory and open the edit modal for that item</li>
          </ul>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>Quick workflow:</strong> Scan → Edit Quantity → Update stock → Done!
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ScanBarcode className="h-5 w-5 text-primary-600 dark:text-primary-500" />
          <h3 className="text-lg font-semibold text-text-900 dark:text-white">Troubleshooting</h3>
        </div>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ul className="space-y-2 text-text-700 dark:text-text-300">
            <li><strong>Camera not working?</strong> Check browser permissions in settings</li>
            <li><strong>Barcode not detected?</strong> Improve lighting, reduce glare, hold barcode flat</li>
            <li><strong>Wrong item detected?</strong> Ensure barcode is centered in the frame</li>
            <li><strong>Item not found?</strong> The barcode may not exist in inventory - add it first</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Accessibility Documentation
const AccessibilityDocs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-950 dark:text-white mb-2">Accessibility</h2>
        <p className="text-text-600 dark:text-text-400">
          Keyboard shortcuts and accessibility features to improve your experience.
        </p>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-900 dark:text-white">Keyboard Shortcuts</h3>
        <div className="bg-white dark:bg-background-50 rounded-lg border border-background-200 dark:border-background-300 overflow-hidden">
          <table className="w-full">
            <thead className="bg-background-100 dark:bg-background-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-900 dark:text-white">Action</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-900 dark:text-white">Shortcut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200 dark:divide-background-300">
              <tr>
                <td className="px-4 py-3 text-text-700 dark:text-text-300">Close modal/popup</td>
                <td className="px-4 py-3">
                  <kbd className="px-2 py-1 bg-background-200 dark:bg-background-300 rounded text-xs font-mono">ESC</kbd>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-text-700 dark:text-text-300">Navigate between pages</td>
                <td className="px-4 py-3 text-text-600 dark:text-text-400 text-sm">Use sidebar navigation</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-text-700 dark:text-text-300">Search inventory</td>
                <td className="px-4 py-3 text-text-600 dark:text-text-400 text-sm">Click search bar, start typing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Theme Options */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-900 dark:text-white">Theme & Contrast</h3>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ul className="space-y-2 text-text-700 dark:text-text-300">
            <li><strong>Dark Mode:</strong> Toggle using the moon/sun icon in the header</li>
            <li><strong>High Contrast:</strong> Dark mode provides better contrast for readability</li>
            <li><strong>Color Coding:</strong> Stock levels use green (high), yellow (medium), red (low)</li>
          </ul>
        </div>
      </div>

      {/* Screen Reader Support */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-900 dark:text-white">Screen Reader Support</h3>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <ul className="space-y-2 text-text-700 dark:text-text-300">
            <li>All interactive elements have descriptive labels</li>
            <li>Tables include proper headers for navigation</li>
            <li>Form inputs have associated labels</li>
            <li>Status messages announce important updates</li>
          </ul>
        </div>
      </div>

      {/* Browser Support */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-text-900 dark:text-white">Browser Support</h3>
        <div className="bg-white dark:bg-background-50 rounded-lg p-4 border border-background-200 dark:border-background-300">
          <p className="text-text-700 dark:text-text-300 mb-3">
            For the best experience, use a modern browser:
          </p>
          <ul className="space-y-1 text-text-700 dark:text-text-300">
            <li>✓ Chrome/Edge (version 90+)</li>
            <li>✓ Firefox (version 88+)</li>
            <li>✓ Safari (version 14+)</li>
          </ul>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Note:</strong> Camera scanning requires browser camera permissions and works best on devices with rear cameras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
