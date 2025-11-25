import { api } from '../utils/apiClient';

export type OrderItem = {
  inventoryId: string;
  itemName: string;
  quantity: number;
};

export type Order = {
  _id: string;
  customer: string;
  items: OrderItem[];
  status: 'Pending' | 'Completed' | 'Cancelled';
  date_created: string;
  last_updated?: string;
};

export type OrderInput = Omit<Order, '_id' | 'date_created' | 'last_updated'>;

/**
 * Fetch all orders
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    console.log('Raw response:', response);
    if (!response.ok) {
      console.error('Response status:', response.status, response.statusText);
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    console.log('Fetched orders:', data);
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


/**
 * Get a specific order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${id}`);

    if (!response.ok) {
      if (response.status === 404) throw new Error('Order not found');
      throw new Error('Failed to fetch order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (order: OrderInput): Promise<Order> => {
  try {
    const response = await api.post('/orders', order);

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update an existing order by ID
 */
export const updateOrder = async (id: string, order: Partial<OrderInput>): Promise<Order> => {
  try {
    const response = await api.put(`/orders/${id}`, order);

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Delete an order by ID
 */
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/orders/${id}`);

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};