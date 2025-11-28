import { api } from '../utils/apiClient';

export type InventoryItem = {
  _id: string;
  item_name: string;
  category: string;
  quantity: number;
  expiry_date?: string;
  threshold: number;
  barcode: string;
  image?: string; // URL path to image file (e.g., "uploads/items/image-123.jpg")
  status?: string;
  date_added?: string;
  last_updated?: string;
};

export type InventoryItemInput = Omit<InventoryItem, '_id' | 'image' | 'status' | 'date_added' | 'last_updated'> & {
  image?: File; // File object for creating/updating items
};

export type InventoryAlert = {
  _id: string;
  item_name: string;
  barcode: string;
  category: string;
  quantity: number;
  threshold: number;
  expiry_date?: string;
  status: string;
  severity: 'critical' | 'warning' | 'low-stock' | 'out-of-stock';
  alertType: 'expired' | 'expiring-soon' | 'expiring' | 'low-stock' | 'out-of-stock';
  daysLeft: number;
};

export type AlertStats = {
  total: number;
  critical: number;
  warning: number;
  lowStock: number;
  outOfStock: number;
  expired: number;
  expiringSoon: number;
  expiring: number;
};

export type AlertsResponse = {
  alerts: InventoryAlert[];
  stats: AlertStats;
};

// Helper function to get full image URL
export const getImageUrl = (imagePath?: string): string | undefined => {
  if (!imagePath) return undefined;
  // If already a full URL, return it
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend backend URL
  return `http://localhost:3001/${imagePath}`;
};

/**
 * Search for inventory items by query string
 * Searches in both barcode and item_name fields
 */
export const searchInventoryItems = async (query: string): Promise<InventoryItem[]> => {
  try {
    const response = await api.get(`/inventory/search?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Failed to search inventory items');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching inventory items:', error);
    throw error;
  }
};

/**
 * Get a specific inventory item by barcode
 */
export const getInventoryItemByBarcode = async (barcode: string): Promise<InventoryItem> => {
  try {
    const response = await api.get(`/inventory/barcode/${encodeURIComponent(barcode)}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Item not found');
      }
      throw new Error('Failed to fetch inventory item');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    throw error;
  }
};

/**
 * Get all inventory items
 */
export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const response = await api.get('/inventory');

    if (!response.ok) {
      throw new Error('Failed to fetch inventory items');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
};

/**
 * Create a new inventory item
 */
export const createInventoryItem = async (item: InventoryItemInput): Promise<InventoryItem> => {
  try {
    const formData = new FormData();

    // Append all fields to FormData
    formData.append('item_name', item.item_name);
    formData.append('category', item.category);
    formData.append('quantity', item.quantity.toString());
    formData.append('threshold', item.threshold.toString());

    if (item.barcode) {
      formData.append('barcode', item.barcode);
    }

    if (item.expiry_date) {
      formData.append('expiry_date', item.expiry_date);
    }

    // Append image file if provided
    if (item.image instanceof File) {
      formData.append('image', item.image);
    }

    const response = await api.post('/inventory', formData);

    if (!response.ok) {
      throw new Error('Failed to create inventory item');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

/**
 * Update an existing inventory item
 */
export const updateInventoryItem = async (id: string, item: Partial<InventoryItemInput>): Promise<InventoryItem> => {
  try {
    const formData = new FormData();

    // Append fields that are provided
    if (item.item_name !== undefined) {
      formData.append('item_name', item.item_name);
    }

    if (item.category !== undefined) {
      formData.append('category', item.category);
    }

    if (item.quantity !== undefined) {
      formData.append('quantity', item.quantity.toString());
    }

    if (item.threshold !== undefined) {
      formData.append('threshold', item.threshold.toString());
    }

    if (item.barcode !== undefined) {
      formData.append('barcode', item.barcode);
    }

    if (item.expiry_date !== undefined) {
      formData.append('expiry_date', item.expiry_date);
    }

    // Append image file if provided
    if (item.image instanceof File) {
      formData.append('image', item.image);
    }

    const response = await api.put(`/inventory/${id}`, formData);

    if (!response.ok) {
      throw new Error('Failed to update inventory item');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

/**
 * Delete an inventory item
 */
export const deleteInventoryItem = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/inventory/${id}`);

    if (!response.ok) {
      throw new Error('Failed to delete inventory item');
    }
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

/**
 * Get inventory alerts for low stock and expiring items
 */
export const getInventoryAlerts = async (): Promise<AlertsResponse> => {
  try {
    const response = await api.get('/inventory/alerts');

    if (!response.ok) {
      throw new Error('Failed to fetch inventory alerts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    throw error;
  }
};
