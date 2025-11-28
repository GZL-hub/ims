import { Request, Response } from "express";
import Customer from "../models/customerModel.js";

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { customer_name, email, organization, phone, address, city, country, notes, status } = req.body;

    if (!customer_name || !email || !organization) {
      return res.status(400).json({ message: "Customer name, email, and organization are required" });
    }

    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "A customer with this email already exists" });
    }

    const customer = new Customer({
      customer_name,
      email,
      organization,
      phone,
      address,
      city,
      country,
      notes,
      status: status || "Active",
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find().sort({ date_created: -1 });
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { customer_name, email, organization, phone, address, city, country, notes, status } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Check if email is being changed and if it's already taken
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return res.status(400).json({ message: "A customer with this email already exists" });
      }
    }

    if (customer_name !== undefined) customer.customer_name = customer_name;
    if (email !== undefined) customer.email = email;
    if (organization !== undefined) customer.organization = organization;
    if (phone !== undefined) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    if (city !== undefined) customer.city = city;
    if (country !== undefined) customer.country = country;
    if (notes !== undefined) customer.notes = notes;
    if (status !== undefined) customer.status = status;

    customer.last_updated = new Date();
    await customer.save({ validateModifiedOnly: true });

    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
