import React from "react";
import { Package, X, Loader2, Upload } from "lucide-react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: {
    item_name: string;
    category: string;
    quantity: string;
    threshold: string;
    barcode: string;
    expiry_date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onImageChange: (file: File | null) => void;
  imageFile: File | null;
  isSubmitting: boolean;
  categories: string[];
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  onImageChange,
  imageFile,
  isSubmitting,
  categories,
}) => {
  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-background-100 rounded-2xl shadow-2xl w-full max-w-2xl border border-background-200 dark:border-background-300 max-h-[90vh] overflow-y-auto m-4">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-background-100 border-b border-background-200 dark:border-background-300 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-text-950 dark:text-white">
              Add New Item
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background-100 dark:hover:bg-background-200 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-text-600" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="item_name"
                placeholder="e.g., Laptop, Desk Chair, Printer"
                value={formData.item_name}
                onChange={onInputChange}
                className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={onInputChange}
                className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="0"
                value={formData.quantity}
                onChange={onInputChange}
                className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
                min="0"
                disabled={isSubmitting}
              />
            </div>

            {/* Threshold */}
            <div>
              <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="threshold"
                placeholder="10"
                value={formData.threshold}
                onChange={onInputChange}
                className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                min="0"
                disabled={isSubmitting}
              />
              <p className="text-xs text-text-500 mt-1">Alert when stock falls below this number</p>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={onInputChange}
                className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
            </div>

            {/* Barcode */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Barcode
              </label>
              <input
                type="text"
                name="barcode"
                placeholder="Enter or scan barcode"
                value={formData.barcode}
                onChange={onInputChange}
                className="w-full border border-background-300 dark:border-background-400 rounded-lg px-4 py-2.5 bg-white dark:bg-background-50 text-text-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-900 dark:text-white mb-2">
                Item Image
              </label>
              {imageFile ? (
                <div className="relative">
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-background-100 dark:bg-background-100 border border-background-300 dark:border-background-300">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Item preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-background-300 dark:border-background-300 rounded-lg cursor-pointer hover:bg-background-50 dark:hover:bg-background-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-text-400 mb-3" />
                    <p className="text-sm text-text-700 dark:text-text-300 font-medium mb-1">
                      Click to upload image
                    </p>
                    <p className="text-xs text-text-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Info Notice */}
          <div className="mt-6 bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-700 rounded-lg p-4">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              <span className="font-medium">Note:</span> Fields marked with <span className="text-red-500">*</span> are required.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-background-200 dark:border-background-300">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-background-300 dark:border-background-400 text-text-700 dark:text-text-300 rounded-lg hover:bg-background-100 dark:hover:bg-background-200 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.item_name || !formData.category || !formData.quantity || isSubmitting}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                !formData.item_name || !formData.category || !formData.quantity || isSubmitting
                  ? "bg-background-300 dark:bg-background-200 text-text-500 cursor-not-allowed"
                  : "bg-primary-900 hover:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-black shadow-sm hover:shadow-md"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add Item</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
