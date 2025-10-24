import React from 'react';
import OrderLog from '../components/dashboard/OrderLog';
import { ShoppingCart, CheckCircle, Clock, Package } from 'lucide-react';

const Orders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-950">Order Management</h1>
          <p className="text-text-600 mt-1">Track and manage all inventory orders</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          New Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background-50 border border-background-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-text-700">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-text-950">23</p>
        </div>

        <div className="bg-background-50 border border-background-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-text-700">Processing</h3>
          </div>
          <p className="text-2xl font-bold text-text-950">15</p>
        </div>

        <div className="bg-background-50 border border-background-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-text-700">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-text-950">142</p>
        </div>

        <div className="bg-background-50 border border-background-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-sm font-medium text-text-700">Total</h3>
          </div>
          <p className="text-2xl font-bold text-text-950">180</p>
        </div>
      </div>

      <OrderLog />
    </div>
  );
};

export default Orders;
