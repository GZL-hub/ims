import { api } from '../utils/apiClient';

export type InventoryItem = {
  _id: string;
  item_name: string;
  category: string;
  quantity: number;
  expiry_date?: string;
  threshold: number;
  barcode: string;
  status?: string;
  date_added?: string;
  last_updated?: string;
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
export const createInventoryItem = async (item: Omit<InventoryItem, '_id'>): Promise<InventoryItem> => {
  try {
    const response = await api.post('/inventory', item);

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
export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
  try {
    const response = await api.put(`/inventory/${id}`, item);

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
