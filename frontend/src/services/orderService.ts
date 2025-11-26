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
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  date_created: string;
  last_updated?: string;
};

export type OrderInput = Omit<Order, '_id' | 'date_created' | 'last_updated'>;

// Backend types
type BackendOrderItem = {
  inventoryId: string;
  item_name: string;
  quantity: number;
};

type BackendOrder = {
  _id: string;
  customer_name: string;
  items: BackendOrderItem[];
  status: string;
  date_created: string;
  last_updated?: string;
};

/** Utility to map backend → frontend */
const mapBackendOrder = (order: BackendOrder): Order => ({
  _id: order._id,
  customer: order.customer_name, // map customer_name → customer
  status: order.status as Order['status'],
  date_created: order.date_created,
  last_updated: order.last_updated,
  items: order.items.map((i) => ({
    inventoryId: i.inventoryId,
    itemName: i.item_name, // map item_name → itemName
    quantity: i.quantity,
  })),
});

/** Fetch all orders */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    if (!response.ok) throw new Error('Failed to fetch orders');

    const data: BackendOrder[] = await response.json();
    return data.map(mapBackendOrder);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/** Get a specific order by ID */
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Order not found');
      throw new Error('Failed to fetch order');
    }

    const data: BackendOrder = await response.json();
    return mapBackendOrder(data);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/** Create a new order */
export const createOrder = async (order: OrderInput): Promise<Order> => {
  try {
    const payload = {
      customer_name: order.customer, // backend expects customer_name
      status: order.status,
      items: order.items.map((i) => ({
        inventoryId: i.inventoryId,
        item_name: i.itemName, // backend expects item_name
        quantity: i.quantity,
      })),
    };

    const response = await api.post('/orders', payload);
    if (!response.ok) throw new Error('Failed to create order');

    const data: BackendOrder = await response.json();
    return mapBackendOrder(data);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/** Update an existing order by ID */
export const updateOrder = async (id: string, order: Partial<OrderInput>): Promise<Order> => {
  try {
    const payload = order.items
      ? {
          ...order,
          items: order.items.map((i) => ({
            inventoryId: i.inventoryId,
            item_name: i.itemName,
            quantity: i.quantity,
          })),
        }
      : order;

    const response = await api.put(`/orders/${id}`, payload);
    if (!response.ok) throw new Error('Failed to update order');

    const data: BackendOrder = await response.json();
    return mapBackendOrder(data);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/** Delete an order by ID */
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/orders/${id}`);
    if (!response.ok) throw new Error('Failed to delete order');
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};