import { api } from '../utils/apiClient';

export type Customer = {
  _id: string;
  customer_name: string;
  email: string;
  organization: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  status: 'Active' | 'Inactive';
  total_orders?: number;
  date_created: string;
  last_updated?: string;
};

export type CustomerInput = Omit<Customer, '_id' | 'date_created' | 'last_updated' | 'total_orders'>;

/** Fetch all customers */
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get('/customers');
    if (!response.ok) throw new Error('Failed to fetch customers');

    const data: Customer[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/** Get a specific customer by ID */
export const getCustomerById = async (id: string): Promise<Customer> => {
  try {
    const response = await api.get(`/customers/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Customer not found');
      throw new Error('Failed to fetch customer');
    }

    const data: Customer = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

/** Create a new customer */
export const createCustomer = async (customer: CustomerInput): Promise<Customer> => {
  try {
    const response = await api.post('/customers', customer);
    if (!response.ok) throw new Error('Failed to create customer');

    const data: Customer = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

/** Update an existing customer by ID */
export const updateCustomer = async (id: string, customer: Partial<CustomerInput>): Promise<Customer> => {
  try {
    const response = await api.put(`/customers/${id}`, customer);
    if (!response.ok) throw new Error('Failed to update customer');

    const data: Customer = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

/** Delete a customer by ID */
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/customers/${id}`);
    if (!response.ok) throw new Error('Failed to delete customer');
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};
